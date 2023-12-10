const mysql = require("mysql");
const bcrypt = require("bcrypt");

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: 'Akanksha@481',
//     database: 'accredian',
//   });

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Akanksha@481",
  database: "accredian",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

const executeQuery = (sql, values) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const userRows = await executeQuery(
      "SELECT * FROM Login WHERE username = ?",
      [username]
    );

    if (userRows.length === 0) {
      return res.status(401).json({ msg: "Incorrect Username or Password", status: false });
    }

    const user = userRows[0];
    console.log("Line 51", user)
    console.log("Line 52", user.password)
    console.log("Line 53", password[0])
    const isPasswordValid = await bcrypt.compare(password[0], user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Incorrect Username or Password", status: false });
    }

    delete user.password;
    return res.status(200).json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

const register = async (req, res, next) => {
  try {
    console.log(req.body);
    const { username, email, password } = req.body;

    const usernameRows = await executeQuery(
      "SELECT * FROM Login WHERE username = ?",
      [username]
    );
    console.log(usernameRows.length);
    if (usernameRows.length > 0) {
      return res.status(409).json({ msg: "Username already used", status: false });
    }
    const emailRows = await executeQuery(
      "SELECT * FROM Login WHERE email = ?",
      [email]
    );
    console.log("Line 82", emailRows.length);
    if (emailRows.length > 0) {
      return res.status(409).json({ msg: "Email already used", status: false });
    }
    console.log("ine 86", password)
    const hashedPassword = await bcrypt.hash(password[0], 10);
    console.log("Line 88 ", hashedPassword, password)
    const result = await executeQuery(
      "INSERT INTO Login (email, username, password) VALUES (?, ?, ?)",
      [email, username, hashedPassword]
    );

    const userId = result.insertId;

    const userRows = await executeQuery("SELECT * FROM Login WHERE id = ?", [
      userId,
    ]);
    const user = userRows[0];

    delete user.password;
    return res.status(201).json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports = { login, register };
