//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(
  "mongodb+srv://admin-shubham:suman@20@cluster0.lzrwf.mongodb.net/gajraj-caterersDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  people: String,
  event: String,
});

const User = new mongoose.model("User", userSchema);

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

adminSchema.plugin(passportLocalMongoose);
adminSchema.plugin(findOrCreate);

const Admin = new mongoose.model("Admin", adminSchema);

passport.use(Admin.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/contact", function (req, res) {
  res.render("contact");
});

app.get("/gallery", function (req, res) {
  res.render("gallery");
});

app.get("/catering", function (req, res) {
  res.render("catering");
});

app.get("/menu", function (req, res) {
  res.render("menu");
});

app.get("/admin", function (req, res) {
  res.render("adminLogin");
});

app.get("/adminDashboard", function (req, res) {
  res.render("adminDashboard");
});

app.post("/submit", function (req, res) {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    people: req.body.people,
    event: req.body.event,
  });

  user.save(function (err, doc) {
    if (err) return console.error(err);
    console.log("Document inserted successfully!");
  });

  res.redirect("/");
});

app.get("/tables", function (req, res) {
  User.find({}, function (err, foundUsers) {
    if (err) {
      res.redirect("/404");
    } else {
      if (foundUsers) {
        res.render("tables", {
          tableUserData: foundUsers,
        });
      }
    }
  });
});

app.post("/register", function (req, res) {
  Admin.register(
    {
      username: req.body.username,
    },
    req.body.password,
    function (err, admin) {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/");
        });
      }
    }
  );
});

app.post("/login", function (req, res) {
  const admin = new Admin({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(admin, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/adminDashboard");
      });
    }
  });
});

app.get("/tables", function (req, res) {
  User.find({}, function (err, foundUsers) {
    if (err) {
      console.log(err);
    } else {
      if (foundUsers) {
        res.render("tables", {
          tableUserData: foundUsers,
        });
      }
    }
  });
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.post("/delete/:id", function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/tables");
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
  console.log("Server started on port 3000");
}
app.listen(port);
