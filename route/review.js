const express = require("express");
const router = express.Router({ mergeParams: true });
const Schema = require("../schema.js");
const Expresserror = require("../utils/Expresserror.js");
const Wrapasync = require("../utils/Wrapasync.js");
const Listing = require("../models/listing.js");
const review = require("../models/review.js");
const { isLoggedin, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controller/review.js");

const validateReview = (req, res, next) => {
    let { err } = Schema.reviewSchema.validate(req.body);
    if (err) {
        let emessage = err.details.map((el) => el.message).join(",");
        throw new Expresserror(400, emessage);
    } else {
        next();
    }
}
//add review
router.post("/", isLoggedin, validateReview, Wrapasync(reviewController.addreview));
//delete review
router.delete("/:reviewid", isReviewAuthor, Wrapasync(reviewController.deletereview));

module.exports = router;