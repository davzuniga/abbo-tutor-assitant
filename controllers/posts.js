const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Request = require("../models/Request");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      req.user.role === 'tutor' ? res.render("tutorProfile.ejs", { posts: posts, user: req.user }) : res.render("studentProfile.ejs", { posts: posts, user: req.user });
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
        requested: false,
        requestedBy: '',
        requestedById: '',
        likes: 0,
        user: req.user.id,
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
