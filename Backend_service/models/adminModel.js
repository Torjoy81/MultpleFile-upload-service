const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    AdminName: {
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
  },
  {
    collection: "AdminInfo",
  }
);

module.exports = mongoose.model("admincc", AdminSchema);
