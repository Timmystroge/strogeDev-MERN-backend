require("dotenv").config(); /* Require DotEnv */
//
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors')
//
const { log } = console;

const app = express();

// set middleware
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));

//
app.route("/").get((req, res) => {
    res.json({msg: 'Backend'})
});

app.listen(process.env.PORT || 3000, () =>
  log("Server Has Started On Port! Happy Coding Stroge")
);
