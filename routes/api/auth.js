const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const {check,validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt  = require("bcryptjs");
//@route = GET api/auth
//@desc =   Work
//@authenticity = public
router.get("/",auth,async (req,res)=>{
  try{
     const user = await User.findById(req.user.id).select("-Password");
     res.json(user);
   }
   catch(err){
     console.error(err.message);
     res.status(500).send("Server Error")
   }
});


//@route =  POST api/auth
//@desc =  Authenticate user and get token
//@authenticity = public

router.post("/",[
  check("email","Email is Required").isEmail(),
  check("Password","Password Required").exists()
], async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }
  const {email,Password} = req.body;

  try{

// Search for user and handle if not found
let user = await User.findOne({email});
if(!user){
return  res.status(400).json({errors:   [ {msg:"Invalid Credentials"} ]   });
}

//comparing the [Password] ;
const isamatch = await bcrypt.compare(Password,user.Password);

if(!isamatch){
return  res.status(400).json({errors:   [ {msg:"Invalid Credentials"} ]   });
}


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
