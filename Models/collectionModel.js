const mongoose = require("mongoose");

const collectionnSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A collection must have a name!"],
  },
  topic: {
    type: String,
    required: [true, "A collection must have a topic!"],
  },
  description: {
    type: String,
    required: [true, "A collection must have a description"],
  },
  image_url: {
    type: String,
    required: false,
    default: "",
  },
  author: {
    type: Object,
    required: [true, "A collection must have a author id"],
  },

  custom_string1: String,
  custom_string2: String,
  custom_string3: String,

  custom_int1: String,
  custom_int2: String,
  custom_int3: String,

  custom_bool1: String,
  custom_bool2: String,
  custom_bool3: String,

  custom_text1: String,
  custom_text2: String,
  custom_text3: String,

  custom_date1: String,
  custom_date2: String,
  custom_date3: String,
});

const Collectionn = mongoose.model("collectionn", collectionnSchema);

module.exports = Collectionn;
