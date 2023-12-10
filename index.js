const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const authRoutes = require("./routes/auth");
const app = express();
app.use(cors())
app.use(express.json())

app.use("/",authRoutes)
app.listen(8081, ()=>{
  console.log('Listening')
})
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'Akanksha@481',
//   database: 'accredian',
// });

// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//     return;
//   }
//   console.log('Connected to MySQL');
// });

// app.post('/signup', (req, res) => {
//   const sql = "INSERT INTO Login (`username`, `email`, `password`) VALUES (?)";
//   console.log(req.body)
//   const values = [
//     req.body.username,
//     req.body.email,
//     req.body.password
//   ]
//   connection.query(sql, [values], (err, data)=>{
//     if(err){
//       console.log(err);
//       return res.json("Error");
//     }
//     return res.json(data);
//   });
// })
