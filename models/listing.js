const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  image: {
    filename: {
      type: String,
      default: "listingimage"
    },
    url: {
      type: String,
      default:
        "https://unsplash.com/photos/misty-forest-with-sunlit-fog-overhead-ufjI0V-mtoc",
      set: (v) =>
        v === ""
          ? "https://unsplash.com/photos/misty-forest-with-sunlit-fog-overhead-ufjI0V-mtoc"
          : v,
    }
  },
  price: Number,
  location: String,
  country: String
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;