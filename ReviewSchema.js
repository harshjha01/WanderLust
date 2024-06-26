const Joi = require("joi");

const ReviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(0).max(5),
    comment: Joi.string().required(),
  }).required(),
});
module.exports = ReviewSchema;
