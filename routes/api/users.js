const express = require("express");
const router = express.Router();
const {check,validationResult} = require("express-validator");
//@route =  POST api/users
//@desc =  REGSITER USER
//@authenticity = public
router.post("/",[
  check("name","Name is Required").not().isEmpty(),
  check("email","Email is Required").isEmail(),
  check("Password","Enter a password of more than 6 digits").isLength({min:6})
],(req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }
  res.send("Users");
})

module.exports = router;
