const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ListingSchema = require("./ListingSchems.js");
const ExpressError = require("./utils/ExpressError.js");
const ReviewSchema = require("./ReviewSchema.js");
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Your must be Logged in");
    return res.redirect("/login");
  }
  next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (
    !listing.owner.equals(res.locals.currUser._id) ||
    req.locals.currUser._id !== "66357a857554e4345364a96a"
  ) {
    req.flash("error", "You are not the owner of this Listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewid } = req.params;
  let review = await Review.findById(reviewid);
  let listing = await Listing.findById(id);
  if (
    (!review.author.equals(res.locals.currUser._id) &&
      !listing.owner.equals(res.locals.currUser._id)) ||
    req.locals.currUser._id !== "66357a857554e4345364a96a"
  ) {
    req.flash(
      "error",
      "You Don't have the option to delete review created by others!"
    );
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//Listing schema validation
module.exports.validateListing = (req, res, next) => {
  let { error } = ListingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

//Review schema velidation
module.exports.validateReview = (req, res, next) => {
  let { error } = ReviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};
