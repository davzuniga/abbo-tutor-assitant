const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Request = require("../models/Request");
const User = require("../models/User");

module.exports = {
//   getPost: async (req, res) => {
//     try {
//       const post = await Post.findById(req.params.id);
//       const requests = await Request.find({post: req.params.id}).sort({ createdAt: "asc" }).lean();
//       res.render("post.ejs", { post: post, user: req.user, requests: requests });
//     } catch (err) {
//       console.log(err);
//     }
//   },
  createRequest: async (req, res) => {
    try {
      // Upload image to cloudinary
      // const result = await cloudinary.uploader.upload(req.file.path);

      await Request.create({
        comment: req.body.comment,
        post: req.params.id,
        createdBy: `${req.user.name} ${req.user.lastName}`,
        createdById: req.user.id,
                // image: result.secure_url,
                // cloudinaryId: result.public_id,
      });
      console.log("Post has been added!");
      res.redirect("/post"+req.params.id);
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
  acceptRequest: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          available: false,
          claimed: true,
          claimedBy: post.requestedBy,
          claimedById: post.requestedById,
          requested: false,
          requestedBy: '',
          requestedById: '',
        },
      );
      console.log("Slot was Assigned");
      res.redirect(`/profile`);
    } catch (err) {
      console.log(err);
    }
  },
  unassignSlot: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          available: true,
          claimed: false,
          claimedBy: '',
          claimedById: '',
          requested: false,
          requestedBy: '',
          requestedById: '',
        },
      );
      console.log("Slot was Unassigned");
      res.redirect(`/profile`);
    } catch (err) {
      console.log(err);
    }
  },
//   likePost: async (req, res) => {
//     try {
//       await Post.findOneAndUpdate(
//         { _id: req.params.id },
//         {
//           $inc: { likes: 1 },
//         }
//       );
//       console.log("Likes +1");
//       res.redirect(`/post/${req.params.id}`);
//     } catch (err) {
//       console.log(err);
//     }
//   },
//   deletePost: async (req, res) => {
//     try {
//       // Find post by id
//       let post = await Post.findById({ _id: req.params.id });
//       // Delete image from cloudinary
//       await cloudinary.uploader.destroy(post.cloudinaryId);
//       // Delete post from db
//       await Post.remove({ _id: req.params.id });
//       console.log("Deleted Post");
//       res.redirect("/profile");
//     } catch (err) {
//       res.redirect("/profile");
//     }
//   },
};
