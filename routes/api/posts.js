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
    });
  }
});


//@route = Get api/posts
//@desc =   Get all posts
//@authenticity = private
router.get("/",auth,async (req,res)=>{
  try {
    const posts = await Post.find().sort({date:-1});
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({
      msg: "Server error"
    });
  }
});



//@route = Get api/posts/:id
//@desc =   Get post with id
//@authenticity = private
router.get("/:id",auth,async (req,res)=>{
  try {
    const post = await Post.findById(req.params.id);
    if(!post){
      return res.status(404).json({msg:"Post not Found"});
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if(err.kind==="ObjectId"){
      return res.status(404).json({msg:"Post not Found"});
    }
    res.status(400).json({
      msg: "Server error"
    });
  }
});

//@route = Delete api/posts/:id
//@desc =   Delete Post
//@authenticity = private
router.delete("/:id",auth,async (req,res)=>{
  try {
    const post = await Post.findById(req.params.id);
    if(!post){
      return res.status(404).json({msg:"Post not Found"});
    }
    if(post.user.toString()!== req.user.id){
      return res.status(401).json({msg:"Unauthorized deletion request"});
    }
    await post.remove();
    res.send("Post Deleted");
  } catch (err) {
    console.error(err.message);
    if(err.kind === "ObjectId"){
      return res.status(404).json({msg:"Post not Found"});
    }
    res.status(400).json({
      msg: "Server error"
    });
  }
})


//LIKES
//@route = Put api/posts/likes/:id
//@desc =   Like a Post
//@authenticity = private
router.put("/likes/:id",auth,async (req,res)=>{
  try {
    const post = await Post.findById(req.params.id);

    if(post.likes.filter(like => like.user.toString() === req.user.id).length>0){
      return res.status(400).json({msg:"post already liked"});
    }
    post.likes.unshift({user:req.user.id});
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({
      msg: "Server error"
    });
  }
});

//@route = Put api/posts/unlike/:id
//@desc =   unLike a Post
//@authenticity = private
router.put("/unlike/:id",auth,async (req,res)=>{
  try {
    const post = await Post.findById(req.params.id);

    if(post.likes.filter(like => like.user.toString() === req.user.id).length===0){
      return res.status(400).json({msg:"Post Not liked"});
    }
    //make a remove index
    const removeIndex = post.likes.map(like=>like.user.toString()).indexOf(req.user.id);

    post.likes.splice(removeIndex,1);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({
      msg: "Server error"
    });
  }
});


//@route = Post api/posts/comment/:id
//@desc =   Create comment
//@authenticity = private
router.post("/comment/:id", [auth, [
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
    const post = await Post.findById(req.params.id);

    const {
      text
    } = req.body;

    const newcomment = {
      text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    };

    post.comments.unshift(newcomment);

    await post.save();

    res.json(post.comments);

  } catch (err) {
    console.error(err.message);
    res.status(400).json({
      msg: "Server error"
    });
  }
});

//@route = Post api/posts/comment/:id/:comment_id
//@desc =   Delete comment
//@authenticity = private
router.delete("/comment/:id/:comment_id",auth,async(req,res)=>{
  try {
    const post = await Post.findById(req.params.id);

    const comment = post.comments.find(comment => comment.id === req.params.comment_id);
    //if there is no comment
    if(!comment){
      return res.status(404).json({msg:"comment does not exist"});
    }
    //authorization
    if(comment.user.toString()!==req.user.id){
      return res.status(401).json({msg:"Unauthorized access"});
    }

    const remove_index = post.comments.map(comment=>comment.user.toString()).indexOf(req.user.id);

    post.comments.splice(remove_index,1);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({
      msg: "Server error"
    });
  }
})

module.exports = router;
