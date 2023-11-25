const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "An item must have a name!"],
  },
  collection: {
    type: Object,
    required: [true, "An item must have id of its collections!"],
    default: {},
  },
  author: {
    type: Object,
    required: [true, "An item must have an author"],
    default: {},
  },
  tags: {
    type: Array,
    required: [true, "An item must have tags!"],
  },
  properties: {
    type: Object,
    required: [true, "An item must have properties!"],
  },
  created_time: {
    type: Date,
    required: [true, "An item must have created time"],
  },
  likes: {
    type: Array,
    required: false,
    default: [],
  },
  comments: {
    type: Array,
    required: false,
    default: [],
  },
  image_url: {
    type: String,
    required: false,
    default: "",
  },
});

const Item = mongoose.model("item", itemSchema);

module.exports = Item;

// Item.create({
//     name: "Shampagne",
//     collection_id: "654fcc25e291cec50d002d43",
//     tags: ["beverage", "drinks", "alcohol", "party"],
//     properties: {
//       origin: "Italy",
//       date: "1965",
//     },
//     likes: ["654fcc25e291cec50d002d43", "654fcc25e291cec50dd43"],
//     comments: [
//       {
//         user_id: "654fcc25e291cec50d002d43",
//         text: "This is very good drink!",
//         published_time: "13:25 October 29",
//         replies: [],
//       },
//     ],
//   });
