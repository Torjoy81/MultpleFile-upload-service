const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    FileInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FileInfo",
      required: true,
      unique: true,
    },
    Status: {
      type: String,
      required: true,
      default: "UnBlocked",
      enum: ["Blocked", "UnBlocked", "RequestForBlock", "RequestForUnBlock"],
    },
  },
  {
    collection: "Admin",
  }
);

module.exports = mongoose.model("AdminDB", adminSchema);
