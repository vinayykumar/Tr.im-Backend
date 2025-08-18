const express = require('express')
const bcrypt = require('bcrypt')
const User = require("../models/user");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
const router = express.Router();
const { signupSchema, loginSchema } = require("../middlewares/validators");


router.post("/signup", async (req, res) => {
    const { error } = signupSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        //Creating new User in DB
        const newUser = new User({ username, email, password: hashedPassword });
        
        //Creating Tokens
        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);

        //Adding refresh token in refreshTokens[]
        newUser.refreshTokens = [refreshToken];
        await newUser.save();

        return res.json({ accessToken, refreshToken });
    } catch (err) {
        res.status(500).json({ error: "Signup failed" });
    }
});

router.post("/login", async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    try {
        const { email, password } = req.body;

        //Validate User
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        //Validate Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid password" });

        //Creating new Tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshTokens.push(refreshToken);
        await user.save();

        return res.json({ accessToken, refreshToken });
        
    } catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
});

router.post("/refresh", async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).json({ error: "Refresh token required" });

    try {
        // Verify the refresh token
        const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

        // Check if it’s still in DB
        const user = await User.findById(payload.id);
        if (!user || !user.refreshTokens.includes(refreshToken)) {
            return res.status(403).json({ error: "Invalid refresh token" });
        }

        // Rotate token: remove old one
        user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);

        // Generate new access token
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        // Save new refreshToken in DB
        user.refreshTokens.push(newRefreshToken);
        await user.save();

        res.json({ accessToken: newAccessToken, refreshToken:newRefreshToken });
    } catch (err) {
        console.error(err);
        res.status(403).json({ error: "Invalid or expired refresh token" });
    }
});

router.post('/logout', async (req, res) => {
    const {refreshToken} = req.body;
    if(!refreshToken) return res.status(401).json({error:"Refresh token required"});

    try{
        const payload = jwt.verify(refreshToken,REFRESH_TOKEN_SECRET);

        const user = await User.findById(payload.id);
        if (!user) return res.status(403).json({ error: "Invalid user" });

        user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
        await user.save();

        res.json({ message: "Logged out successfully" });
    }
    catch(err){
        console.error(err);
        res.status(403).json({ error: "Invalid or expired refresh token" });
    }
})

module.exports = router;