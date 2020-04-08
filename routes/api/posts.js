const express = require("express");
const router = express.Router();

//@route = GET api/posts
//@desc =   Test
//@authenticity = public
router.get("/",(req,res)=>{
  res.send("posts");
})

module.exports = router;
