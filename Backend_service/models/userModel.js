const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
      trim: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 50,
      trim: true,
    },
    Password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 200,
    },
    IP_address: {
      type: String,
      required: true,
    },
  },
  {
    collection: "Users",
  }
);

module.exports = mongoose.model("User", UserSchema);
