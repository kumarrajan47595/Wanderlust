const user=require("../models/user");

module.exports.signup=(req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signedup=async (req, res) => {
    try {
        let { email, username, password } = req.body;
        const newUser = new user({ email, username });
        const registeduser = await user.register(newUser, password);
        console.log(registeduser);
        req.login(registeduser, (err) => {
            if (err) {
                next(err);
            }
            req.flash("success", "Welcome to wanderlust");
            res.redirect("/listings");
        })

    } catch (e) {
        req.flash("error", e.message);
    }

}

module.exports.login= (req, res) => {
    res.render("users/login.ejs");
}

module.exports.loggedin=async (req, res) => {
    req.flash("success", "Welcome back to wanderlust!");
    let checkredirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(checkredirectUrl);
}

module.exports.logout=(req, res) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "logged out!");
        res.redirect("/listings");
    });
}