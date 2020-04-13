const express = require("express");
const router = express.Router();
const {
  check,
  validationResult
} = require("express-validator");
const auth = require("../../middleware/auth");
const Post = require("../../models/post");
const User = require("../../models/User");
const Profile = require("../../models/profile");

//@route = Post api/posts
//@desc =   Create Post
//@authenticity = private
router.post("/", [auth, [
  check("text", "Text is required").not().isEmpty()
]], async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({
      error: error.array()
    });
  }

  try {
    const user = await User.findById(req.user.id).select("-password");
    
    const {
      text
    } = req.body;

    const newPost = new Post({
      text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    });
    const post = await newPost.save();
    res.json(post);

  } catch (err) {
    console.error(err.message);
    res.status(400).json({
      msg: "Server error"
    })
  }
});
module.exports = router;
