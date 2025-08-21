const express = require('express')
const router = express.Router();
const {handleLogoutUser, handleRefreshToken, handleResetPassword, handleForgotPassword, handleLoginUser, handleResendOTP, handleVerifyOTP, handleSignupUser} = require('../controllers/auth')


router.post("/signup", handleSignupUser);

router.post("/verify-otp", handleVerifyOTP);

router.post("/resend-otp", handleResendOTP);

router.post("/login", handleLoginUser);

router.post('/forgot-password', handleForgotPassword);

router.post("/reset-password/:token", handleResetPassword);

router.post("/refresh", handleRefreshToken);

router.post('/logout', handleLogoutUser)

module.exports = router;