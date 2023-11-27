const User = require("../Models/userModel");
const Item = require("../Models/itemModel");
const express = require("express");

const router = express.Router();
// router.param('id', checkId);

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      status: "success",
      users: users,
      length: users.length,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};

const searchUser = async (req, res, next) => {
  try {
    const searchTerm = req.body.text;

    // Get the model's schema and extract the field names
    let fields = Object.keys(YourModel.schema.paths);

    fields = fields.filter((f) => f !== "_id" || f !== "__v");

    // Build a query dynamically
    const query = {};
    fields.forEach((field) => {
      query[field] = new RegExp(searchTerm, "i");
    });

    const user = await User.find(query).select("-password").exec();
    console.log("Text 🧇" + req.body.text);
    console.log("Query 🥙" + query);
    if (user.length === 0) {
      res.status(404).json({
        status: "fail",
        message: "Could not find a user",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      user: user,
    });
  } catch (error) {
    console.log("🥩", error);
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findOne(req.query).select("-password").exec();

    if (user.length === 0) {
      res.status(404).json({
        status: "fail",
        message: "Could not find a user",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      user: user,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: "Invalid email",
    });
  }
};

const addUser = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);

    res.status(201).json({
      status: "success",
      User: newUser,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!user) {
      res.status(204).json({
        status: "fail",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(404).json({
        status: "fail",
        message: "Could not find user",
      });
      return;
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};

router.route("/getAllUsers").get(getAllUsers);
router.route("/addUser").post(addUser);
router.route("/user/:id").put(updateUser).delete(deleteUser);
router.route("/user").get(getUser);
router.route("/searchUser").get(searchUser);

module.exports = router;
