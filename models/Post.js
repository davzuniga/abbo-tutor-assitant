const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: String,
  dayOfTheWeek: { type: String, required: true },
  time: { type: String, required: true },
  recurrent: { type: Boolean, required: true },
  available: Boolean,
  claimed: Boolean,
  claimedBy: String,
  claimedById: String,
  requested: Boolean,
  requestedBy: String,
  requestedById: String,
  likes: {
    type: Number,
    required: true,
  },
  tutorName: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // image: {
  //   type: String,
  // },
  // cloudinaryId: {
  //   type: String,
  // },
});

module.exports = mongoose.model("Post", PostSchema);
