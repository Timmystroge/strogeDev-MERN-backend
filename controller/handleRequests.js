// StroMin App - Mongodb, Express, React, Node - MERN
// Contact developer: Timmystroge75@gmail.com
// GitHub: https://github.com/Timmystroge
// Happy Coding!

const currentDate = require("./date");

function handleRequests(app, StrogeDevUsers, UserThoght) {
  // Home route
  app.route("/").get((req, res) => {
    res.json({
      msg: "404 Not Found!",
      Developer: "https://github.com/Timmystroge",
    });
  });

  //   AUth/Login route
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

    // Check if user with email address exist
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

  // Registration with secured system
  // app.post("/register", (req, res) => {
  //   const { fullname, email, password } = req.body;

  // });

  //  USER route
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

  // Create Route
  app.post("/create", (req, res) => {
    const { id, thought } = req.body;

    const currentdate = currentDate() + ".";
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

  // Thoughts route
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

  // Handle irrelevant routes
  app.get("/*", (req, res) => {
    res.json({
      msg: "Seems you are lost!",
      Developer: "https://github.com/Timmystroge",
    });
  });
}

module.exports = handleRequests;
