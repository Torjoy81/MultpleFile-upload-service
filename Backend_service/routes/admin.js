const axios = require("axios");
const app = require("express");
const admin = app.Router();
const adminModel = require("../models/adminRequestModel");
const adminInfoModel = require("../models/adminModel");
const FileModel = require("../models/fileModel");
const crypto = require("crypto");
const fs = require("fs");

admin.post("/", (req, res) => {
  const { ID, status } = req.body;
  const adminDB = new adminModel({
    FileInfo: ID,
    Status: status,
  });
  adminDB.save(function (err, result) {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(201).send("File has been requested");
    }
  });
});

admin.put("/:id", async (req, res) => {
  const { status } = req.body;
  adminModel.findOneAndUpdate(
    { FileInfo: req.params.id },
    {
      Status: status,
    },
    { new: true },
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send(result);
      }
    }
  );
});

admin.get("/", async (req, res) => {
  const result = await adminModel.find();
  if (!result) {
    res.status(500).send("Internal Server Error");
  }
  res.send(result);
});

admin.get("/requestBlock/:id", async (req, res) => {
  const result = await FileModel.findById(req.params.id);
  const buffer = fs.readFileSync(result.path);
  const finalHex = crypto.createHash("sha256").update(buffer).digest("hex");
  console.log(finalHex);
  axios({
    method: "put",
    url: `https://www.tu-chemnitz.de/informatik/DVS/blocklist/${finalHex}`,
    headers: {
      Cookie: process.env.COOKIE,
    },
  })
    .then((item) => {
      if (item.status === 201) {
        adminModel.updateOne(
          { FileInfo: req.params.id },
          { Status: "Blocked" },
          { new: true },
          function (err, result) {
            if (err) {
              console.log(err);
            } else {
              res.status(200).send(result);
            }
          }
        );
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

admin.get("/requestUnBlock/:id", async (req, res) => {
  const result = await FileModel.findById(req.params.id);
  const buffer = fs.readFileSync(result.path);
  const finalHex = crypto.createHash("sha256").update(buffer).digest("hex");

  axios({
    method: "delete",
    url: `https://www.tu-chemnitz.de/informatik/DVS/blocklist/${finalHex}`,
    headers: {
      Cookie: process.env.COOKIE,
    },
  })
    .then((item) => {
      if (item.status === 204) {
        adminModel.findOneAndUpdate(
          { FileInfo: req.params.id },

          {
            Status: "UnBlocked",
          },
          { new: true },
          function (err, result) {
            if (err) {
              console.log(err);
            } else {
              res.status(200).send(result);
            }
          }
        );
      }
    })
    .catch((err) => {
      console.log(err.headers);
    });
});

admin.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const aItem = await adminInfoModel.findOne({
    Email: email,
    Password: password,
  });
  if (aItem) {
    res.send({ ...aItem, adminAuth: true });
  } else {
    return res.send(404, { error: "The email and password are invaild" });
  }
});

admin.get("/logout", (req, res) => {
  res.send({ adminAuth: false });
});
module.exports = admin;
