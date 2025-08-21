const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/auth");
const URL = require("../models/url");
const {shortenLimiter} = require('../middlewares/ratelimiter')
const {handleMyUrls, handleGetOriginalUrl, handleGetShortUrl} = require('../controllers/url')

// Protected route: create a short URL
router.post("/shorten", shortenLimiter, authenticateToken, handleGetShortUrl);

//Public route : get Redirected/Original URL
router.get('/:shortID', handleGetOriginalUrl);

//Protected route : get all urls of current user with userID
router.get('/my-urls', authenticateToken,handleMyUrls)

module.exports = router;
