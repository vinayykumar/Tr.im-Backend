const express = require('express')
const bcrypt = require('bcrypt')
const User = require("../models/user");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);

        return res.json({ accessToken, refreshToken });
    } catch (err) {
        res.status(500).json({ error: "Signup failed" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid password" });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        return res.json({ accessToken, refreshToken });
        
    } catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
});

module.exports = router;