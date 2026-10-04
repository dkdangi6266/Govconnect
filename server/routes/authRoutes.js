const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getMe
} = require("../controllers/authController");

const { authenticate } = require("../middleware/authMiddleware");

const {
  registerValidator,
  loginValidator
} = require("../validators/authValidator");

const validate = require("../middleware/validationMiddleware");


// Register
router.post(
  "/register",
  registerValidator,
  validate,
  register
);


// Login
router.post(
  "/login",
  loginValidator,
  validate,
  login
);


// Current user
router.get(
  "/me",
  authenticate,
  getMe
);


module.exports = router;