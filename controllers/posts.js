const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Request = require("../models/Request");
const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      const requests = await Request.find({post: req.params.id}).sort({ createdAt: "asc" }).lean();
      const claimedSlots = await Post.find({claimedById: req.user.id}).sort({ createdAt: "asc" }).lean();
      req.user.role === 'tutor' ? res.render("tutorProfile.ejs", { posts: posts, user: req.user, requests: requests }) : res.render("studentProfile.ejs", { posts: posts, user: req.user, requests: requests, claimedSlots: claimedSlots, });
      // res.render("profile.ejs", { posts: posts, user: req.user })
    } catch (err) {
      console.log(err);
    }
  },
  getTutorCalendar: async (req, res) => {
    try {
      const tutor = await User.find( { calendarCode: req.query.calendarCode }).lean();
      console.log(tutor)
      const posts = await Post.find({ calendar: req.query.calendarCode });
      const requests = await Request.find({post: req.params.id}).sort({ createdAt: "asc" }).lean();
      const claimedSlots = await Post.find({claimedById: req.user.id}).sort({ createdAt: "asc" }).lean();
      req.user.role === 'tutor' ? res.render("tutorProfile.ejs", { posts: posts, user: req.user, requests: requests }) : res.render("myTutorCalendar.ejs", { tutor: tutor, posts: posts, user: req.user, requests: requests, claimedSlots: claimedSlots, });
      // res.render("profile.ejs", { posts: posts, user: req.user })
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const requests = await Request.find({post: req.params.id}).sort({ createdAt: "asc" }).lean();
      res.render("post.ejs", { post: post, user: req.user, requests: requests });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      // const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        dayOfTheWeek: req.body.dayOfTheWeek,
        time: `${req.body.hour}:${req.body.minutes} ${req.body.amPm}`,
        recurrent: req.body.recurrent,
        available: true,
        claimed: false,
        claimedBy: '',
        claimedById: '',
        requested: false,
        requestedBy: '',
        requestedById: '',
        likes: 0,
        tutorName: `${req.user.name} ${req.user.lastName}`,
        user: req.user.id,
        calendar: req.user.calendarCode,
                // image: result.secure_url,
                // cloudinaryId: result.public_id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  requestSlot: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          requested: true,
          requestedBy: `${req.user.name} ${req.user.lastName}`,
          requestedById: req.user.id,
        }
      );
      console.log("Requested Slot");
      res.redirect(`/profile`);
    } catch (err) {
      console.log(err);
    }
  },
  assignSlot: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          claimed: true,
          claimedBy: requestedBy,
          claimedById: requestedById,
          requested: false,
          requestedBy: "",
          requestedById: "",
        }
      );
      console.log("Requested Slot");
      res.redirect(`/profile`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
