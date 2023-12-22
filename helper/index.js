require("dotenv").config();
const jwt = require("jsonwebtoken");
const getUserFromToken = (req) => {
  const token = req.cookies.accessToken || req.headers.authorization.split(" ")[1];

  if (!token) return null;

  console.log("token accesss");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = decoded.user;
    return user;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

module.exports = { getUserFromToken };
