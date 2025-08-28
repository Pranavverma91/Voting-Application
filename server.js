const express = require("express")
const app = express();
const db = require("./db");
const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");

require("dotenv").config({  quiet: true,
  override: false,  
  debug: false });

const bodyParser = require("body-parser"); 
app.use(bodyParser.json()); 
const PORT = process.env.PORT || 3000;


app.use("/user", userRoutes);
app.use("/candidate",candidateRoutes);

app.listen(PORT, ()=>{
    console.log(`server is running on port http://localhost:${PORT}`);
})