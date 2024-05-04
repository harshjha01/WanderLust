const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.postReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newRating = new Review(req.body.review);
  newRating.author = req.user._id;
  listing.reviews.push(newRating);
  await newRating.save();
  await listing.save();
  let id = req.params.id;
  req.flash("success", "New Review Posted");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewid } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
  await Review.findByIdAndDelete(reviewid);
  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`);
};
