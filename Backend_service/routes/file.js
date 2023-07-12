const app = require("express");
const fs = require("fs");
const file = app.Router();
const FileModel = require("../models/fileModel");
const crypto = require("crypto");
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const { Throttle, ThrottleGroup } = require("stream-throttle");

const checkext = {
  "application/pdf": ".pdf",
  "application/vnd.ms-powerpoint": ".ppt",

  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    ".pptx",

  "application/vnd.rar": ".rar",
  "image/png": ".png",
  "image/jpeg": ".jpeg",
  "image/gif": ".gif",
  "image/jpg": ".jpg",
  "application/zip": ".zip",
  "application/msword": ".doc",

  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",

  "text/csv": ".csv",
  "text/html": ".html",
  "text/plain": ".txt",
};

const tg = new ThrottleGroup({ rate: 1024 * 100 });

const limiter = rateLimit({
  max: 1,
  windowMs: 10 * 60 * 1000,
  message: "You can download for each 10 minute",
});

file.post("/uploadFile", (req, res) => {
  const { filename, originalname, mimetype, path, size } = req.file;
  const { id } = req.body;
  const orgFl = originalname.replace(".", " ");
  const fileDBM = new FileModel({
    fileName: filename,
    originalName: orgFl.split(" ")[0],
    contentType: mimetype,
    owner: id,
    size: size,
    path: path,
  });
  if (size < 10000000) {
    fileDBM.save(function (err, result) {
      if (err) {
        console.log(err);
        res.send(500, { error: err });
      } else {
        res.status(201).send(result);
      }
    });
  } else {
    res.send(404, { error: "File Size is Over 10MB" });
  }
});

file.get("/", async (req, res) => {
  const result = await FileModel.find();
  if (!result) {
    res.status(500).send("Internal Server Error");
  }
  res.send(result);
});

file.get("/:ID", limiter, async (req, res, next) => {
  const downId = req.params.ID;
  const fsItem = await FileModel.findById(downId);

  const buffer = fs.readFileSync(fsItem.path);
  const finalHex = crypto.createHash("sha256").update(buffer).digest("hex");
  axios({
    method: "get",
    url: `https://www.tu-chemnitz.de/informatik/DVS/blocklist/${finalHex}`,
    headers: {
      Cookie: process.env.COOKIE,
    },
  })
    .then((item) => {
      if (item.status === 210) {
        res.status(500).send("File is Blocked");
      } else {
        res.setHeader("Content-Type", `${fsItem.contentType}`);
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${fsItem.originalName}${
            checkext[fsItem.contentType]
          }"`
        );
        const rstream = fs.createReadStream(fsItem.path);
        rstream.pipe(tg.throttle()).pipe(res);
        rstream
          .on("open", () => {
            console.log("fs Open");
          })
          .on("data", (chunk) => {
            console.log(chunk.length);
          })
          .on("close", () => {
            console.log("close");
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = file;
