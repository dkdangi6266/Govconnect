const express = require("express");

const {
    register,
    login,
    getMe
} = require("../controllers/authController");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", authenticate, getMe);

router.get(
    "/admin-test",
    authenticate,
    authorize("super_admin"),
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome Super Admin"
        });
    }
);

module.exports = router;