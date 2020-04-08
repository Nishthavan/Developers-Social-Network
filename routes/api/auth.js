const express = require("express");
const router = express.Router();

//@route = GET api/auth
//@desc =   Test
//@authenticity = public
router.get("/",(req,res)=>{
  res.send("Auth");
})

module.exports = router;
