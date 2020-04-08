const express = require('express');
const app = express();
const connectDb = require("./config/db");

connectDb();

app.get('/',(req,res)=>{res.send("Running");});

// ROUTES TO APIS
app.use("/api/auth",require("./routes/api/auth"));
app.use("/api/profile",require("./routes/api/profile"));
app.use("/api/posts",require("./routes/api/posts"));
app.use("/api/users",require("./routes/api/users"));





//LISTENING Ports

// .ENV package is used for deploying to heroku
const PORT = process.env.PORT || 4000;
app.listen(PORT,()=>{
  console.log(`Server Started on Port ${PORT}.`)
});
