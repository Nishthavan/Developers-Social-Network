const express = require("express");
const router = express.Router();

//@route = GET api/users
//@desc =   Test
//@authenticity = public
router.get("/",(req,res)=>{
  res.send("Users");
})

module.exports = router;
