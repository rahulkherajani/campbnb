var express = require("express"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  flash = require("connect-flash"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override")
expressSession = require("express-session")
Campground = require("./models/campgroundModel"),
  Comment = require("./models/commentModel"),
  User = require("./models/userModel"),
  seedDB = require("./seeds"),
  app = express();


//Importing  Routes
var commentRoutes = require("./routes/commentRoutes"),
  campgroundRoutes = require("./routes/campgroundRoutes"),
  authenticationRoutes = require("./routes/authenticationRoutes")

//MongoDB Setup
// mongoose.connect('mongodb://localhost:27017/campbnb', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb+srv://RahulK:Rahul@20@campbnbcluster.jt8qg.mongodb.net/campbnbcloud?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
//BodyParser Setup
app.use(bodyParser.urlencoded({ extended: true }));

//Method Override Setup
app.use(methodOverride("_method"));

//View Engine Setup
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//Connect Flash Setup
app.use(flash());

//Seed Data
//seedDB();

//test environment variables
console.log(process.env.PORT, process.env.IP);

// PASSPORT CONFIGURATION
app.use(expressSession({
  secret: "Camp Bread and Breakfast",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//To Supply User Info & Flash Messages to all the routes.
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});


//Landing Page Route
app.get("/", function (req, res) {
  res.render("landing");
});

app.use("/", authenticationRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//Listen to Requests
app.listen(process.env.PORT, process.env.IP, function () {
  console.log("The CampBnB Server Has Started!");
});