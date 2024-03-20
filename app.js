if (process.env.NODE_ENV != "prodution") {
  require("dotenv").config()
}
console.log(process.env.SCRETE)

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const Wrapasync = require("./utils/Wrapasync.js");
const Expresserror = require("./utils/Expresserror.js");
const review = require("./models/review.js");
const listroute = require("./route/listings.js");
const reviewroute = require("./route/review.js");
const userroute = require("./route/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const passportlocalmongoose = require("passport-local-mongoose");
const Localstrategy = require("passport-local");
const user = require("./models/user.js");


const dburl=process.env.ATLAS_URL;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "/public")));


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

const store=MongoStore.create({
  mongoUrl:dburl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
})

store.on("error",()=>{
  console.log("Error in mongo session store",err);
})

const sessionOption = {
  store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
}
app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})


app.get("/demouser", async (req, res) => {
  let fakeuser = new user({
    email: "rajan@gmail.com",
    username: "rajankumar",
  })
  let registeduser = await user.register(fakeuser, "rajan");
  res.send(registeduser);
})

app.use("/listings", listroute);
app.use("/listings/:id/reviews", reviewroute);
app.use("/", userroute);


app.all("*", (req, res, next) => {
  next(new Expresserror(404, "page not found"));
})
app.use((err, req, res, next) => {
  let { status = 505, message = "something went wrong" } = err;
  res.status(status).render("./listings/error.ejs", { message });
})
app.listen(8080, () => {
  console.log("server is listening to port 8080");
});