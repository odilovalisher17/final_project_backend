const express = require("express");
const userRouter = require("./Controllers/userController");
const collectionRouter = require("./Controllers/collectionConroller");
const itemRouter = require("./Controllers/itemController");

const app = express();

app.use((req, res, next) => {
  const allowedOrigins = [
    "https://my-box-final-project.netlify.app",
    "http://localhost:3000",
    // Add more origins as needed
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/collections", collectionRouter);
app.use("/api/v1/items", itemRouter);

module.exports = app;
