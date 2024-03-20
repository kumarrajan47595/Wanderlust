const Listing=require("../models/listing.js");
const review=require("../models/review.js");
//add review
module.exports.addreview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log("review saved");
    req.flash("success","Review added!");
    res.redirect(`/listings/${listing._id}`)
}

module.exports.deletereview=async (req, res) => {
    let { id, reviewid } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await review.findByIdAndDelete(reviewid);
    req.flash("success","Review deleted!");
    res.redirect(`/listings/${id}`);
}