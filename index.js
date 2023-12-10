const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const authRoutes = require("./routes/authRoutes");
const app = express();
app.use(cors())
app.use(express.json())

app.use("/",authRoutes)
app.listen(8081, ()=>{
  console.log('Listening')
})
