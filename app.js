const express = require("express");
const userRouter = require("./Controllers/userController");
const collectionRouter = require("./Controllers/collectionConroller");
const itemRouter = require("./Controllers/itemController");

const app = express();

// Add CORS middleware
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://my-box-final-project.netlify.app"
  );
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
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
