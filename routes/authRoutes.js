const { login, register } = require("../controllers/authController");
const router = require("express").Router();

router.post("/", login);
router.post("/signup", register);

module.exports = router;
