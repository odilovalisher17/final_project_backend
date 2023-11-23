const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "A user must have a first name"],
  },
  lastName: {
    type: String,
    required: [true, "A user must have a last name"],
  },
  email: {
    type: String,
    required: [true, "A user must have an email"],
    unique: [true, "This email already registered"],
  },
  password: {
    type: String,
    required: [true, "A user must have password"],
  },
  role: {
    type: String,
    required: [true, "A user must have a role"],
  },
  status: {
    type: String,
    required: [true, "A user must have status"],
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;

// User.create({
//   firstName: "Alisher",
//   lastName: "Odilov",
//   email: "odilovalisher17@gmail.com",
//   password: "123456",
//   role: "user",
//   status: "active",
// });
