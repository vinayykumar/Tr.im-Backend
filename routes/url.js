const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/auth");
const URL = require("../models/url");
const {shortenLimiter} = require('../middlewares/ratelimiter')
const {handleMyUrls, handleGetOriginalUrl, handleGetShortUrlPrivate, handleGetShortUrlPublic} = require('../controllers/url')

// Protected route: create a short URL
router.post("/shorten", shortenLimiter, authenticateToken, handleGetShortUrlPrivate);

//Public route : create a short URL w/o login
router.post('/shorten/public',handleGetShortUrlPublic)

//Public route : get Redirected/Original URL
router.get('/:shortID', handleGetOriginalUrl);

//Protected route : get all urls of current user with userID
router.get('/my-urls', authenticateToken,handleMyUrls)

module.exports = router;
