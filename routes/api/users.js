const express = require("express");
const router = express.Router();
//JUST GIVES US GRAVATAR BASED ON EMAIL
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const {check,validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
//REQUIRING MONGOOSE MODEL
const User  = require("../../models/User");
const config = require("config");



//@route =  POST api/users
//@desc =  REGSITER USER
//@authenticity = public

router.post("/",[
  check("name","Name is Required").not().isEmpty(),
  check("email","Email is Required").isEmail(),
  check("Password","Enter a password of more than 6 digits").isLength({min:6})
], async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }
  const {name,email,Password} = req.body;

  try{

// Search for user already Registered
let user = await User.findOne({email});
if(user){
return  res.status(400).json({errors:   [ {msg:"User already exists"} ]   });
}

//Getting Gravatar of user
const avatar = gravatar.url(email,{
  s:"200",
  r:"pg",
  d:"mm"
})

// creating user
user = new User({
  name,
  email,
  avatar,
  Password
});

// encrypting Password using bcrypt
const salt = await bcrypt.genSalt(10);
user.Password = await bcrypt.hash(Password,salt);

await user.save();



//getting jsonwebtoken
const payload = {
  user: {
    id: user.id
  }
}
  jwt.sign(
    payload,
    config.get("jwtToken"),
    {expiresIn:360000},
    (err,token)=>{
      if(err) throw err;
      res.json({token});
    }
  )

  }catch(err){
    console.error(err.message);
    res.status(500).send("server error");
  }


});
module.exports = router;
