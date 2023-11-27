const User = require("../Models/userModel");
const Item = require("../Models/itemModel");
const express = require("express");
const Collectionn = require("../Models/collectionModel");

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
    const searchTerm = req.query.text;

    // Get the model's schema and extract the field names
    const fields = Object.keys(User.schema.paths);

    // Build a query dynamically
    const query = {
      $or: fields
        .filter(
          (field) =>
            !field.startsWith("_") &&
            field !== "__v" &&
            field !== "_id" &&
            field !== "password"
        )
        .map((field) => ({ [field]: { $regex: new RegExp(searchTerm, "i") } })),
    };

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;

    const user = await User.find(query)
      .skip(skip)
      .limit(limit)
      .select("-password")
      .exec();

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

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
      pageInfo: {
        currentPage: page,
        totalPages: totalPages,
      },
    });
  } catch (error) {
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
    await Collectionn.deleteMany({ "author.id": req.params.id });
    await Item.deleteMany({ "author.id": req.params.id });

    const userCommentsItems = await Item.find({});

    await Promise.all(
      userCommentsItems.map(async (el) => {
        const newCommnets = el._doc.comments.filter(
          (c) => c.user.id !== req.params.id
        );

        const newLikes = el._doc.likes.filter((l) => l !== req.params.id);

        await Item.findByIdAndUpdate(el._doc._id, {
          comments: newCommnets,
          likes: newLikes,
        });
      })
    );

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
