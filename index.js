require("dotenv").config(); /* Require DotEnv */
//
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
//
const { log } = console;

const app = express();

// set middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//? CONNECTION TO DATABASE, DATABASE SCHEMA, DATABASE MODEL
mongoose.connect(process.env.API_URL);
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
app.route("/").get((req, res) => {
  res.json({ msg: "Strge-Dev Server API" });
});

/*  AUTH/REGISTER */
app.route("/auth/register").post((req, res) => {
  const { fullname, email, password } = req.body;
  log(fullname, email, password);

  // create a new user
  const user = new StrogeDevUsers({
    fullname: fullname,
    email: email,
    password: password,
  });

  user.save();

  res.json({ msg: "Account Created Successfully!" });
});

app.listen(process.env.PORT || 3000, () =>
  log("Server Has Started On Port! Happy Coding Stroge")
);
