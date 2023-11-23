const Item = require("../Models/itemModel");
const User = require("../Models/userModel");
const Collectionn = require("../Models/collectionModel");
const express = require("express");

const router = express.Router();
// router.param('id', checkId);

const getAllItems = async (req, res, next) => {
  try {
    let query = req.query.collection_id
      ? {
          "collection.id": req.query.collection_id,
        }
      : {};

    const items = await Item.find(query);

    const newItems = await Promise.all(
      items.map(async (el) => {
        const author = await User.findById(el._doc.author.id).exec();
        const collect = await Collectionn.findById(
          el._doc.collection.id
        ).exec();
        return {
          ...el._doc,
          author: {
            id: author._id,
            firstName: author.firstName,
            lastName: author.lastName,
          },
          collection: {
            id: collect._id,
            name: collect.name,
          },
        };
      })
    );

    res.status(200).json({
      status: "success",
      length: newItems.length,
      items: newItems,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};

const getItem = async (req, res, next) => {
  try {
    const item = await Item.findOne({ _id: req.params.id }).exec();

    if (!item) {
      res.status(404).json({
        status: "fail",
        message: "Could not find an item",
      });
      return;
    }

    const [userOfItem, collectionOfItem] = await Promise.all([
      User.findById(item.author.id).exec(),
      Collectionn.findById(item.collection.id).exec(),
    ]);

    const newCommentsArray = await Promise.all(
      item.comments.map(async (el) => {
        const authorOfComment = await User.findById(el.user.id).exec();
        return {
          ...el,
          user: {
            id: authorOfComment._id,
            firstName: authorOfComment.firstName,
            lastName: authorOfComment.lastName,
          },
        };
      })
    );

    res.status(200).json({
      status: "success",
      Item: {
        ...item._doc,
        author: {
          id: userOfItem.id,
          firstName: userOfItem.firstName,
          lastName: userOfItem.lastName,
        },
        comments: newCommentsArray,
        collection: {
          id: collectionOfItem._id,
          name: collectionOfItem.name,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

const addItem = async (req, res, next) => {
  try {
    const newItem = await Item.create(req.body);

    res.status(201).json({
      status: "success",
      Item: newItem,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

const updateItem = async (req, res, next) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!item) {
      res.status(204).json({
        status: "fail",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      item,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) {
      res.status(404).json({
        status: "fail",
        message: "Could not find item",
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

const getAllTags = async (req, res, next) => {
  try {
    const tags = await Item.find({}).select("tags");

    res.status(200).json({
      status: "success",
      tags,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};

router.route("/getAllItems").get(getAllItems);
router.route("/getAllTags").get(getAllTags);
router.route("/addItem").post(addItem);
router.route("/item/:id").get(getItem).put(updateItem).delete(deleteItem);

module.exports = router;
