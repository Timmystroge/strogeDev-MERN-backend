require("dotenv").config(); /* Require DotEnv */
//
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const currentDate = require("./controller/date");
//
const { log } = console;

const app = express();

// set middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//? CONNECTION TO DATABASE, DATABASE SCHEMA, DATABASE MODEL
mongoose.connect(process.env.LOCAL_API_URL);
try {
  log("Connected!");
} catch {
  log("Failed!");
}

//Create Schema
const userSchema = new mongoose.Schema({
  fullname: { type: String },
  email: { type: String },
  password: { type: String, min: 6 },
});

// Create database Model
const StrogeDevUsers = mongoose.model("StrogeDevUsers", userSchema);
//

// Create Thoughts Schmea
const thoughtSchema = new mongoose.Schema({
  uid: String,
  timeStamp: String,
  thought: String,
});

// create databse model
const UserThoght = mongoose.model("UserThought", thoughtSchema);

app.route("/").get((req, res) => {
  res.json({
    msg: "404 Not Found!",
    Developer: "https://github.com/Timmystroge",
  });
});

app.route("/auth/login").post((req, res) => {
  const { email, password } = req.body;
  // check if user with login details exist
  StrogeDevUsers.findOne({ email: email }).then((foundUser) => {
    if (!foundUser) {
      res.json({ msg: "userNotExist" });
    } else {
      const foundUserPassword = foundUser.password;
      if (password === foundUserPassword) {
        res.json({ msg: "success", userID: foundUser._id });
      } else {
        res.json({ msg: "passwordNotMatch" });
      }
    }
  });
});

/*  AUTH/REGISTER */
app.route("/auth/register").post((req, res) => {
  const { fullname, email, password } = req.body;
  //
  // if no user exist with this email - create a new user
  const user = new StrogeDevUsers({
    fullname: fullname,
    email: email,
    password: password,
  });

  // check if user with email address exist
  StrogeDevUsers.findOne({ email: email }).then((foundUser) => {
    if (!foundUser) {
      user.save(); /* Save new user to database */
      res.json({ msg: "success", userID: user._id });
    } else {
      /* if user with email exist send feedback */
      res.json({ msg: "emailExist" });
    }
  });
});

app.post("/user", (req, res) => {
  const { userID } = req.body;
  StrogeDevUsers.findOne({ _id: userID }).then((foundUser) => {
    if (foundUser) {
      res.json({
        msg: "success",
        user: { fullname: foundUser.fullname, email: foundUser.email },
      });
    } else {
      res.json({ msg: "userNotFound" });
    }
  });
});

app.post("/create", (req, res) => {
  const { id, thought } = req.body;

  const currentdate = currentDate();
  // create new thought
  const newThought = new UserThoght({
    uid: id,
    timeStamp: currentdate,
    thought: thought,
  });

  newThought.save().then(() => {
    res.json({ msg: "saved" });
  });
});

app
  .route("/thoughts")
  .post((req, res) => {
    const { userID } = req.body;
    UserThoght.find({ uid: userID }).then((foundUser) => {
      if (foundUser.length === 0) {
        res.json({ msg: "success", status: "noData" });
      } else {
        res.json({ msg: "success", status: "data", userData: foundUser });
      }
    });
  })
  .delete((req, res) => {
    const uid = req.body.uid;
    UserThoght.deleteOne({ _id: uid }).then((data) => {
      res.json({ msg: "success" });
    });
  });

app.get("/*", (req, res) => {
  res.json({
    msg: "Seems you are lost!",
    Developer: "https://github.com/Timmystroge",
  });
});

app.listen(process.env.PORT || 3000, () =>
  log("Server Has Started On Port! Happy Coding Stroge")
);
