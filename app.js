if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

//requiring stuff
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//server
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dburl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dburl);
}

//mongodb session

const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: "code",
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("Error in mongo session store");
});

//creating sessions using express session
const sessionOptions = {
  store,
  secret: "code",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash()); //using flash milldleware

// using passport
app.use(passport.initialize()); // middleware to initialize passport
app.use(passport.session()); // using session for every user
passport.use(new localStrategy(User.authenticate())); //using strategy for passport

passport.serializeUser(User.serializeUser()); //it stores user related data once user login
passport.deserializeUser(User.deserializeUser()); //it deletes user related data once user log-out

//setting up local veriable
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

//requiring routes
const listingrouters = require("./routes/listing.js");
const reviewrouter = require("./routes/review.js");
const userrouter = require("./routes/user.js");

//using routes
app.use("/listings", listingrouters);
app.use("/listings/:id/reviews", reviewrouter);
app.use("/", userrouter);

app.get("/", (req, res) => {
  res.redirect("/listings");
});

//middlewares
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { code = 500, message = "something went wrong" } = err;
  res.render("error.ejs", { message });
  // res.status(code).send(message);
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
