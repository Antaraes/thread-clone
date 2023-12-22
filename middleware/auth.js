const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("./catchAsyncErrors.js");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel.js");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.accessToken || req.headers.authorization.split(" ")[1];
  console.log(token);

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decode.user._id);
    if (!user) {
      return res.json({ success: false, message: "Unauthorized access!" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.json({ success: false, message: "Unauthorized access!" });
    }
    if (error.name === "TokenExpiredError") {
      return res.json({
        success: false,
        message: "Session expired, try signing in again!",
      });
    }

    res.json({ success: false, message: "Internal server error!" });
  }
});
