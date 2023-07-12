const app = require("express");
const user = app.Router();
const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

user.post("/signup", async (req, res) => {
  const { Name, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const userDB = new UserModel({
    userName: Name,
    Email: email,
    Password: await bcrypt.hash(password, salt),
    IP_address: req.socket.remoteAddress,
  });
  userDB.save(function (err, result) {
    if (err) {
      return res.status(400).send(err);
    } else {
      res.send(result);
    }
  });
});

user.get("/login", (req, res) => {
  if (req.session.sid) {
    UserModel.findById(req.session.sid, (err, doc) => {
      res.send({ ...doc, logedIn: true });
    });
  } else {
    res.send({ logedIn: false });
  }
});

user.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const uItem = await UserModel.findOne({ Email: email });
  console.log(uItem);
  if (!uItem) {
    return res.status(404).send("The email and password are invalid");
  } else {
    const validPassword = await bcrypt.compare(password, uItem.Password);
    if (validPassword) {
      req.session.sid = uItem.id;
      req.session.userName = uItem.userName.toUpperCase();
      res.send(uItem);
    } else {
      return res.status(404).send("The email and password are invalid");
    }
  }
});

module.exports = user;
