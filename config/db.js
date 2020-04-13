const mongoose  = require("mongoose");
const config = require("config");

const db1 = config.get("mongoURI");


// ASCYN AND AWAIT ARE USED IN PLACE OF PROMISES to CONTROL THE EVENT LOOP
const connectDB = async () => {
  try{
    await mongoose.connect(db1,{useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify:false
  });
    console.log("MongoDB Connected........")
  }
  catch(err){
       console.error(err.message);
       //Exit with status 1
       process.exit(1);
  }

}


module.exports = connectDB;
