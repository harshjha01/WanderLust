const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ReviewSchema = require("../ReviewSchema.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const ReviewController = require("../controllers/reviews.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
  isOwner,
} = require("../middleware.js");

//Review route
//post an new review

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(ReviewController.postReview)
);

//Delete the review
router.delete(
  "/:reviewid",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(ReviewController.deleteReview)
);
module.exports = router;
