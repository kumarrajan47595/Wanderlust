const express = require("express");
const router = express.Router({ mergeParams: true });
const Expresserror = require("../utils/Expresserror.js");
const Wrapasync = require("../utils/Wrapasync.js");
const Schema = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedin, isOwner } = require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});


const validatelistings = (req, res, next) => {
    console.log(req.body)
    let { err } = Schema.listingSchema.validate(req.body);
    if (err) {
        let emessage = err.details.map((el) => el.message).join(",");
        throw new Expresserror(400, emessage);
    } else {
        next();
    }
}

//index rout
router.route("/")
    .get(Wrapasync(listingController.index))
    .post(isLoggedin,upload.single("listing[image]"), validatelistings, Wrapasync(listingController.createnew));
   
// new rout
router.get("/new", isLoggedin, listingController.newindex);
//show rout
router.route("/:id")
    .get(Wrapasync(listingController.show))
    .put(isLoggedin, isOwner,upload.single("listing[image]"), validatelistings, Wrapasync(listingController.update))
    .delete(isLoggedin, isOwner, Wrapasync(listingController.distroy));

//edit rout
router.get("/:id/edit", isLoggedin, isOwner, Wrapasync(listingController.edit))

module.exports = router;