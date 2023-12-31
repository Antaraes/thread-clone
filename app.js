const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const ErrorHandler = require("./middleware/error");
// const Image = require("./assets/1.jpg");
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "500mb" }));
app.use(express.urlencoded({ limit: "1000mb", extended: true }));

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: ".env",
  });
}

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Route imports
const user = require("./routes/user");
const post = require("./routes/Post");

app.use("/api/v1", user);
app.use("/api/v1", post);

app.get("/api/v1", (req, res, next) => {
  res.send("Helloworld");
});
app.use(ErrorHandler);

// it's for errorHandeling

module.exports = app;
