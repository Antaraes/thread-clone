const Post = require("../models/PostModel");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const cloudinary = require("cloudinary");
const Notification = require("../models/NotificationModel");
const { myAdmin } = require("../config/firebase.js");
const { getUserFromToken } = require("../helper/index.js");

var bucket = myAdmin.storage().bucket();

exports.createPost = catchAsyncErrors(async (req, res, next) => {
  console.log("createPost");
  try {
    const user = await getUserFromToken(req);
    console.log(user);
    const { posts } = req.body;
    console.log(posts);

    if (!Array.isArray(posts) || posts.length === 0) {
      return next(new ErrorHandler("Invalid or empty posts data", 400));
    }

    let successPosts = [];

    for (const item of posts) {
      let postImageURL = null;
      console.log(item);

      if (item.image && item.image !== "") {
        const postImageBuffer = Buffer.from(item.image, "base64");
        const postFilename = `${user.userName}/posts/${Date.now()}_${Math.floor(
          Math.random() * 1000
        )}.jpg`;
        const postFile = bucket.file(postFilename);
        await postFile.save(postImageBuffer, {
          metadata: {
            contentType: "image/jpeg",
          },
        });

        postImageURL = await postFile.getSignedUrl({ action: "read", expires: "01-01-2100" });
        console.log(postImageURL);
      }

      const post = new Post({
        title: item.title,
        image: postImageURL ? postImageURL[0] : null,
        user: user._id,
      });

      successPosts.push(post);
      await post.save();
    }

    res.status(201).json({
      success: true,
      successPosts,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// get all posts
// exports.getAllPosts = catchAsyncErrors(async (req, res, next) => {
//   try {
//     const posts = await Post.find()
//       .sort({
//         createdAt: -1,
//       })
//       .populate("user", ["email", "name", "avatar"]);

//     res.status(201).json({ success: true, posts });
//   } catch (error) {
//     return next(new ErrorHandler(error.message, 400));
//   }
// });
exports.getAllPosts = catchAsyncErrors(async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const posts = await Post.find()
      .sort({
        createdAt: -1,
      })
      .skip(startIndex)
      .limit(limit)
      .populate("user", ["email", "name", "avatar"]);

    const totalPosts = await Post.countDocuments();

    const pagination = {};

    if (endIndex < totalPosts) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      posts,
      pagination,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// add or remove likes
exports.updateLikes = catchAsyncErrors(async (req, res, next) => {
  try {
    const { postId } = req.body;

    const loggedInUser = await getUserFromToken(req);
    const post = await Post.findById(postId);

    const isLikedBefore = post.likes.some((item) => item.user.equals(loggedInUser._id));
    console.log("isLikedBefore", isLikedBefore, "loggedInUser", loggedInUser);
    if (isLikedBefore) {
      await Post.findByIdAndUpdate(postId, {
        $pull: {
          likes: {
            user: loggedInUser._id,
          },
        },
      });

      if (loggedInUser._id !== post.user) {
        await Notification.deleteOne({
          "creator._id": loggedInUser._id,
          userId: post.user,
          type: "Like",
        });
      }

      res.status(200).json({
        success: true,
        message: "Like removed successfully",
      });
    } else {
      await Post.updateOne(
        { _id: postId },
        {
          $push: {
            likes: {
              user: loggedInUser._id,
              postId,
            },
          },
        }
      );

      if (loggedInUser._id !== post.user) {
        await Notification.create({
          creator: req.user,
          type: "Like",
          title: "Liked your post",
          userId: post.user,
          postId: postId,
        });
      }

      res.status(200).json({
        success: true,
        message: "Like Added successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, 400));
  }
});

// add replies in post
exports.addReplies = catchAsyncErrors(async (req, res, next) => {
  try {
    const postId = req.body.postId;

    let myCloud;

    if (req.body.image) {
      myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
        folder: "posts",
      });
    }

    const replyData = {
      user: req.user,
      title: req.body.title,
      image: req.body.image
        ? {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          }
        : null,
      likes: [],
    };

    // Find the post by its ID
    let post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Add the reply data to the 'replies' array of the post
    post.replies.push(replyData);

    // Save the updated post
    await post.save();

    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, 400));
  }
});

// add or remove likes on replies
exports.updateReplyLikes = catchAsyncErrors(async (req, res, next) => {
  try {
    const postId = req.body.postId;
    const replyId = req.body.replyId;
    const replyTitle = req.body.replyTitle;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Find the reply in the 'replies' array based on the given replyId
    const reply = post.replies.find((reply) => reply._id.toString() === replyId);

    if (!reply) {
      return res.status(404).json({
        success: false,
        message: "Reply not found",
      });
    }

    const isLikedBefore = reply.likes.find((item) => item.userId === req.user.id);

    if (isLikedBefore) {
      // If liked before, remove the like from the reply.likes array
      reply.likes = reply.likes.filter((like) => like.userId !== req.user.id);

      if (req.user.id !== post.user._id) {
        await Notification.deleteOne({
          "creator._id": req.user.id,
          userId: post.user._id,
          type: "Reply",
          postId: postId,
        });
      }

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Like removed from reply successfully",
      });
    }

    // If not liked before, add the like to the reply.likes array
    const newLike = {
      name: req.user.name,
      userName: req.user.userName,
      userId: req.user.id,
      userAvatar: req.user.avatar.url,
    };

    reply.likes.push(newLike);

    if (req.user.id !== post.user._id) {
      await Notification.create({
        creator: req.user,
        type: "Like",
        title: replyTitle ? replyTitle : "Liked your Reply",
        userId: post.user._id,
        postId: postId,
      });
    }

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Like added to reply successfully",
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, 400));
  }
});

// add reply in replies
exports.addReply = catchAsyncErrors(async (req, res, next) => {
  try {
    const replyId = req.body.replyId;
    const postId = req.body.postId;

    let myCloud;

    if (req.body.image) {
      myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
        folder: "posts",
      });
    }

    const replyData = {
      user: req.user,
      title: req.body.title,
      image: req.body.image
        ? {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          }
        : null,
      likes: [],
    };

    // Find the post by its ID
    let post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Find the reply by it's ID
    let data = post.replies.find((reply) => reply._id.toString() === replyId);

    if (!data) {
      return next(new ErrorHandler("Reply not found", 401));
    }

    data.reply.push(replyData);

    // Save the updated post
    await post.save();

    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, 400));
  }
});

// add or remove likes on replies reply
exports.updateRepliesReplyLike = catchAsyncErrors(async (req, res, next) => {
  try {
    const postId = req.body.postId;
    const replyId = req.body.replyId;
    const singleReplyId = req.body.singleReplyId;
    const replyTitle = req.body.replyTitle;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Find the reply in the 'replies' array based on the given replyId
    const replyObject = post.replies.find((reply) => reply._id.toString() === replyId);

    if (!replyObject) {
      return res.status(404).json({
        success: false,
        message: "Reply not found",
      });
    }

    // Find the specific 'reply' object inside 'replyObject.reply' based on the given replyId
    const reply = replyObject.reply.find((reply) => reply._id.toString() === singleReplyId);

    if (!reply) {
      return res.status(404).json({
        success: false,
        message: "Reply not found",
      });
    }

    // Check if the user has already liked the reply
    const isLikedBefore = reply.likes.some((like) => like.userId === req.user.id);

    if (isLikedBefore) {
      // If liked before, remove the like from the reply.likes array
      reply.likes = reply.likes.filter((like) => like.userId !== req.user.id);

      if (req.user.id !== post.user._id) {
        await Notification.deleteOne({
          "creator._id": req.user.id,
          userId: post.user._id,
          type: "Reply",
          postId: postId,
        });
      }

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Like removed from reply successfully",
      });
    }

    // If not liked before, add the like to the reply.likes array
    const newLike = {
      name: req.user.name,
      userName: req.user.userName,
      userId: req.user.id,
      userAvatar: req.user.avatar.url,
    };

    reply.likes.push(newLike);

    if (req.user.id !== post.user._id) {
      await Notification.create({
        creator: req.user,
        type: "Like",
        title: replyTitle ? replyTitle : "Liked your Reply",
        userId: post.user._id,
        postId: postId,
      });
    }

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Like added to reply successfully",
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, 400));
  }
});

// delete post
exports.deletePost = catchAsyncErrors(async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new ErrorHandler("Post is not found with this id", 404));
    }

    if (post.image?.public_id) {
      await cloudinary.v2.uploader.destroy(post.image.public_id);
    }

    await Post.deleteOne({ _id: req.params.id });

    res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error, 400));
  }
});
