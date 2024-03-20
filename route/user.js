const express = require("express");
const router = express.Router({ mergeParams: true });
const user = require("../models/user.js");
const Wrapasync = require("../utils/Wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");

router.route("/signup")
    .get(userController.signup)
    .post(Wrapasync(userController.signedup));

//router.post("/signup", Wrapasync(userController.signedup));

router.route("/login")
    .get(userController.login)
    .post(saveRedirectUrl,
        passport.authenticate('local', {
            failureRedirect: "/login",
            failureFlash: true
        }), Wrapasync(userController.loggedin));


// router.post("/login",
//     saveRedirectUrl,
//     passport.authenticate('local', {
//         failureRedirect: "/login",
//         failureFlash: true
//     }), Wrapasync(userController.loggedin));

router.get("/logout", userController.logout);
module.exports = router;