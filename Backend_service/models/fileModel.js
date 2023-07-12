const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
      unique: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,

      required: true,
    },
    isPublish: { type: Boolean, default: true },
    date: { type: Date, default: Date.now },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    size: {
      type: Number,
      required: true,
    },
    path: {
      type: String,
      require: true,
    },
  },
  {
    collection: "FileInformation",
  }
);

module.exports = mongoose.model("FileInfo", fileSchema);
