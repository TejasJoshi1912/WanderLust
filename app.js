const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js"); 
const session = require ("express-session");
const flash = require("connect-flash")


const sessionOption = {
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+ 7 *24*60*60*1000,
    maxAge:7 *24*60*60*1000,
  },
  };

// Root
app.get("/", (req, res) => {
  res.send("HI! I am root");
});

app.use(session(sessionOption));
app.use(flash())


app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");

  next();
})

const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Mongo connection
main()
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(Mongo_URL);
}

// EJS & middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

// 404 handler
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found!!"));
});

// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  if (res.headersSent) return next(err);
  try {
    res.status(statusCode).render("error.ejs", { message });
  } catch (e) {
    res.status(500).send(message);
  }
});

// Start server
app.listen(8080, () => console.log("Server listening on port 8080"));