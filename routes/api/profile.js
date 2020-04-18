const express = require("express");
const router = express.Router();
const Profile = require("../../models/profile");
const User = require("../../models/User");
const auth = require("../../middleware/auth");
const {
  check,
  validationResult
} = require("express-validator");
const config = require("config");
const request = require("request");

//@route = GET api/profile/me
//@desc =   Getting profile of user
//@authenticity = private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("users", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({
        msg: "Profile not available"
      });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({
      msg: "Server Error"
    });

  }
});

//@route = GET api/profile
//@desc =  Creating or updating Profile
//@authenticity = private

router.post("/", [auth, [
  check("status", "status is required").not().isEmpty(),
  check("skills", "Skills are required").not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const {
    company,
    location,
    website,
    bio,
    skills,
    status,
    githubusername,
    youtube,
    twitter,
    instagram,
    linkedin,
    facebook
  } = req.body;

  //BUILD PROFILE OBJ
  const profileFields = {};
  profileFields.user = req.user.id;
  if (company) profileFields.company = company;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (website) profileFields.website = website;
  if (status) profileFields.status = status;
  if (githubusername) profileFields.githubusername = githubusername;
  if (skills) {
    profileFields.skills = skills.split(',').map(skill => skill.trim());
  }

  profileFields.social = {};
  if (instagram) profileFields.social.instagram = instagram;
  if (twitter) profileFields.social.twitter = twitter;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (facebook) profileFields.social.facebook = facebook;
  if (youtube) profileFields.social.youtube = youtube;

  try {
    let profile = await Profile.findOne({
      user: req.user.id
    });
    if (profile) {
      profile = await Profile.findOneAndUpdate({
        user: req.user.id
      }, {
        $set: profileFields
      }, {
        new: true
      });
      return res.json(profile);
    }

    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route = GET api/profile
//@desc = Getting profile of all users
//@authenticity = public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
})


//@route = GET api/profile/user/:user_id
//@desc = Getting profile by user id
//@authenticity = public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({
        msg: "There is no user"
      });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == ObjectId) {
      return res.status(400).json({
        msg: "There is no user"
      });
    }
    res.status(500).send("Server Error");
  }
});


//@route = Delete api/profile
//@desc = Delete profiles,user and posts
//@authenticity = private
router.delete("/", auth, async (req, res) => {
  try {
    //PROFILE DELETED
    await Profile.findOneAndRemove({
      user: req.user.id
    });
    //USER DELETED
    await User.findOneAndRemove({
      _id: req.user.id
    });
    res.json({
      msg: "User Deleted"
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


//@route = Put api/profile/experience
//@desc = Adding experience
//@authenticity = private
router.put("/experience", [auth, [
  check("title", "Title is required").not().isEmpty(),
  check("company", "Company is required").not().isEmpty(),
  check("from", "From date is required").not().isEmpty()
]], async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body;
  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  };

  try {
    const profile = await Profile.findOne({
      user: req.user.id
    });
    profile.experience.unshift(newExp);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Server Error")
  }
});



//@route = Delete api/profile/experience/:exp_id
//@desc = Deleting experience
//@authenticity = private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    });
    const removeIndexExp = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
    profile.experience.splice(removeIndexExp, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Server Error");
  }
})




//@route = Put api/profile/education
//@desc = Adding education
//@authenticity = private
router.put("/education", [auth, [
  check("school", "School is required").not().isEmpty(),
  check("degree", "degree is required").not().isEmpty(),
  check("fieldofstudy", "Field of study is required").not().isEmpty(),
  check("from", "From date is required").not().isEmpty()
]], async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = req.body;
  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  };

  try {
    const profile = await Profile.findOne({
      user: req.user.id
    });
    profile.education.unshift(newEdu);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Server Error")
  }
});




//@route = Delete api/profile/education/:edu_id
//@desc = Deleting education
//@authenticity = private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    });
    const removeIndexEdu = profile.education.map(item => item.id).indexOf(req.params.edu_id);
    profile.education.splice(removeIndexEdu, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Server Error");
  }
});




//@route = Put api/profile/github/:username
//@desc = Getting Repos
//@authenticity = public
router.get("/github/:username", async (req, res) => {
  try {
    const options  = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get("githubClientId")}&client_secret=${config.get("githubClientSecret")}`,
      method: "GET",
      headers: {"user-agent":"node.js"}
    };

   request(options,(error,response,body)=>{
        if(error){
          console.error(error);
        }
        if(response.statusCode!==200){
          return  res.status(404).json({msg:"No Github Profile Found"});
        }

        res.json(JSON.parse(body));
   })
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Server Error");
  }
});


module.exports = router;
