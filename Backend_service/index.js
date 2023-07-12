const express = require("express");
const app = express();
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./routes/user");
const File = require("./routes/file");
const path = require("path");
const Admin = require("./routes/admin");
const run = require("./BlockService");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to Mongodb...");
  })
  .catch((err) => console.error("couldn't connect to Mongodb", err));

const store = new MongoDBStore({
  uri: MONGO_URI,
  collection: "mySessions",
});

const fileType = [
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.rar",
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/jpg",
  "application/zip",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/csv",
  "text/html",
  "text/plain",
];

const fileFilter = (req, file, cb) => {
  if (fileType.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "FileContainer"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

run.BlockAuth();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(
  session({
    secret: "key that will be assigned by cookie",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60,
      sameSite: "lax",
      secure: false,
    },
  })
);

app.use(express.json());
app.use(
  multer({
    storage: fileStorage,
    limits: { fileSize: 10000000 },
    fileFilter: fileFilter,
  }).single("fileContainer")
);
app.use(express.urlencoded({ extended: false }));

app.use("/user", User);
app.use("/filemanager", File);
app.use("/admin", Admin);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`LISTENING PORT ${PORT}`);
});
