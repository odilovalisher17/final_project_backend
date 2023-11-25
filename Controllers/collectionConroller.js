const Collectionn = require("../Models/collectionModel");
const User = require("../Models/userModel");
const Item = require("../Models/itemModel");
const express = require("express");

const router = express.Router();
// router.param('id', checkId);

const getAllCollections = async (req, res, next) => {
  try {
    let query = req.query.user_id
      ? {
          "author.id": req.query.user_id,
        }
      : {};

    const collections = await Collectionn.find(query);

    const newCollections = await Promise.all(
      collections.map(async (el) => {
        const author = await User.findById(el._doc.author.id).exec();

        return {
          ...el._doc,
          author: {
            id: author._id,
            firstName: author.firstName,
            lastName: author.lastName,
          },
        };
      })
    );

    res.status(200).json({
      status: "success",
      collections: newCollections,
      length: newCollections.length,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};

const getCollection = async (req, res, next) => {
  try {
    const collect = await Collectionn.findOne({ _id: req.params.id }).exec();
    const userOfCol = await User.findById(collect.author.id).exec();

    if (collect.length === 0) {
      res.status(404).json({
        status: "fail",
        message: "Could not find a collection",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      collectionn: {
        ...collect._doc,
        author: {
          ...collect._doc.author,
          firstName: userOfCol.firstName,
          lastName: userOfCol.lastName,
        },
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

const addCollection = async (req, res, next) => {
  try {
    const newCol = await Collectionn.create(req.body);

    res.status(201).json({
      status: "success",
      collection: newCol,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

const updateCollection = async (req, res, next) => {
  try {
    const collection = await Collectionn.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!collection) {
      res.status(204).json({
        status: "fail",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      collection,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};

const deleteCollection = async (req, res, next) => {
  try {
    const collection = await Collectionn.findByIdAndDelete(req.params.id);
    await Item.deleteMany({ "collection.id": req.params.id });

    if (!collection) {
      res.status(404).json({
        status: "fail",
        message: "Could not find collection",
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

router.route("/getAllCollections").get(getAllCollections);
router.route("/addCollection").post(addCollection);
router
  .route("/collection/:id")
  .get(getCollection)
  .put(updateCollection)
  .delete(deleteCollection);

module.exports = router;
