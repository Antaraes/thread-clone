const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken.js");
const fs = require("fs");
const cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken");
const Notification = require("../models/NotificationModel");
const admin = require("firebase-admin");
const Jimp = require("jimp");
var serviceAccount = require("../config/serviceAccountKey.json");
const { myAdmin } = require("../config/firebase.js");
const { getUserFromToken } = require("../helper/index.js");

var bucket = myAdmin.storage().bucket();

// Register user
exports.createUser = catchAsyncErrors(async (req, res, next) => {
  console.log("Register");
  try {
    const { name, email, password, avatar } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const userNameWithoutSpace = name.replace(/\s/g, "");

    const uniqueNumber = Math.floor(Math.random() * 1000);
    let avatarURL = null;
    if (avatar) {
      try {
        const imageBuffer = Buffer.from(avatar, "base64");

        const avatarFileName = `${
          userNameWithoutSpace + uniqueNumber
        }/profile/${Date.now()}_${Math.floor(Math.random() * 1000)}_${name}.jpg`;
        const avatarFile = bucket.file(avatarFileName);

        await avatarFile.save(imageBuffer, {
          metadata: {
            contentType: "image/jpeg",
          },
        });
        avatarURL = await avatarFile.getSignedUrl({
          action: "read",
          expires: "01-01-2100",
        });
        console.log(avatarURL);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error uploading avatar" });
      }
    }
    console.log(avatarURL[0]);

    user = await User.create({
      name,
      email,
      password,
      userName: userNameWithoutSpace + uniqueNumber,
      avatar: avatarURL[0],
      followers: [],
      following: [],
    });

    sendToken(user, 201, res);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
});

// Login User
const messages = {
  usernameNotExist: "Username is not found. Invalid login credentials.",
  wrongRole: "Please make sure this is your identity.",
  loginSuccess: "You are successfully logged in.",
  wrongPassword: "Incorrect password.",
  loginError: "Oops! Something went wrong.",
};
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let foundUser;
    console.log("email: " + email + " password: " + password);
    foundUser = await User.findOne({ email: email });

    if (!foundUser) {
      return res.status(404).json({
        reason: "User not found",
        message: messages.usernameNotExist,
        success: false,
      });
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
      const accessToken = jwt.sign(
        {
          user: foundUser,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );
      const refreshToken = jwt.sign({ user: foundUser }, process.env.JWT_SECRET_KEY, {
        expiresIn: "5d",
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "None", secure: true });

      const result = {
        user: {
          ...foundUser._doc,
        },
        accessToken: `${accessToken}`,
        refreshToken: refreshToken,
        expiresIn: "30s",
      };
      return res.status(200).json({
        ...result,
        message: messages.loginSuccess,
        success: true,
      });
    } else {
      return res.status(403).json({
        reason: "password",
        message: messages.wrongPassword,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    let errorMsg = messages.loginError;
    if (error.isJoi === true) {
      error.status = 403;
      errorMsg = error.message;
    }
    return res.status(500).json({
      reason: "server",
      message: errorMsg,
      success: false,
    });
  }
});

//  Log out user
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({
    success: true,
    message: "Log out success",
  });
});

//  Get user Details
exports.userDetails = catchAsyncErrors(async (req, res, next) => {
  const loggedInuser = await getUserFromToken(req);
  const user = await User.findById(loggedInuser._id);
  res.status(200).json({
    success: true,
    user,
  });
});

// get all users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const loggedInuser = await getUserFromToken(req);
  const users = await User.find({ _id: { $ne: loggedInuser._id } }).sort({
    createdAt: -1,
  });

  res.status(201).json({
    success: true,
    users,
  });
});

exports.followUnfollowUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const loggedInUser = await getUserFromToken(req);
    const { userId } = req.body;
    console.log(req.body);

    const isFollowedBefore = loggedInUser.following.some((item) => item.userId === userId);

    console.log("userid", userId);
    console.log("isFollowedBefore", isFollowedBefore);
    const loggedInUserId = loggedInUser._id;

    if (isFollowedBefore) {
      console.log("Unfollowing");
      // Unfollow logic
      await User.updateOne({ _id: userId }, { $pull: { followers: { userId: loggedInUserId } } });

      await User.updateOne({ _id: loggedInUserId }, { $pull: { following: { userId: userId } } });

      await Notification.deleteMany({
        "creator._id": loggedInUserId,
        userId: userId,
        type: "Follow",
      });

      await Notification.create({
        creator: req.user,
        type: "unFollow",
        title: "unFollowed you",
        userId: userId,
      });

      res.status(200).json({
        success: true,
        message: "User unfollowed successfully",
        user: await getUserFromToken(req),
      });
    } else {
      // Follow logic
      await User.updateOne({ _id: userId }, { $push: { followers: { userId: loggedInUserId } } });

      await User.updateOne({ _id: loggedInUserId }, { $push: { following: { userId: userId } } });

      await Notification.create({
        creator: req.user,
        type: "Follow",
        title: "Followed you",
        userId: userId,
      });

      res.status(200).json({
        success: true,
        message: "User followed successfully",
        user: await getUserFromToken(req),
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 401));
  }
});

// get user notification
exports.getNotification = catchAsyncErrors(async (req, res, next) => {
  try {
    const loggedInUser = await getUserFromToken(req);
    const notifications = await Notification.find({ userId: loggedInUser._id })
      .populate("userId")
      .sort({
        createdAt: -1,
      });

    res.status(201).json({
      success: true,
      notifications,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 401));
  }
});

// get signle user
exports.getUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(201).json({ success: true, user });
  } catch (error) {
    return next(new ErrorHandler(error.message, 401));
  }
});

// update user avatar
exports.updateUserAvatar = catchAsyncErrors(async (req, res, next) => {
  try {
    let existsUser = await User.findById(req.user.id);

    if (req.body.avatar !== "") {
      const imageId = existsUser.avatar.public_id;

      await cloudinary.v2.uploader.destroy(imageId);

      const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
      });

      existsUser.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    await existsUser.save();

    res.status(200).json({
      success: true,
      user: existsUser,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 401));
  }
});

// update user info
exports.updateUserInfo = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    user.name = req.body.name;
    user.userName = req.body.userName;
    user.bio = req.body.bio;

    await user.save();

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 401));
  }
});
