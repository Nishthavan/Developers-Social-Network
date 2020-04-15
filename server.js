const express = require('express');
const app = express();
const connectDB = require("./config/db");

connectDB();
app.get('/',(req,res)=>{res.send("Running");});

//INTI BODY-PARSER USING EXPRESS.JSON;
//INIT middleware
app.use(express.json({extended:false}));



// ROUTES TO APIS
app.use("/api/auth",require("./routes/api/auth"));
app.use("/api/profile",require("./routes/api/profile"));
app.use("/api/posts",require("./routes/api/posts"));
app.use("/api/users",require("./routes/api/users"));




//Listening Ports


// .ENV package is used for deploying to heroku
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
  console.log(`Server Started on Port ${PORT}.`)
});
