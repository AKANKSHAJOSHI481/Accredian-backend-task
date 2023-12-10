const mysql = require("mysql");
const bcrypt = require("bcrypt");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
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
    const { username, email, password } = req.body;

    const usernameRows = await executeQuery(
      "SELECT * FROM Login WHERE username = ?",
      [username]
    );
    if (usernameRows.length > 0) {
      return res.status(409).json({ msg: "Username already used", status: false });
    }
    const emailRows = await executeQuery(
      "SELECT * FROM Login WHERE email = ?",
      [email]
    );
    if (emailRows.length > 0) {
      return res.status(409).json({ msg: "Email already used", status: false });
    }
    const hashedPassword = await bcrypt.hash(password[0], 10);
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
