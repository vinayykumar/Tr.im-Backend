const URL = require('../models/url')


async function handleMyUrls(req,res) {
    try{
        const urls = await URL.find({userID : req.params.id}).lean();

        const data = urls.map((url) => ({
            shortID: url.shortID,
            redirectedURL: url.redirectedURL,
            createdAt: url.createdAt,
            expiresAt: url.expiresAt,
            totalClicks: url.visitHistory.length,
            visits: url.visitHistory   // full visit details
        }));

        return res.json(data)
    }
    catch(err){
        return res.status(500).json({ error: "Could not fetch URLs" });
    }
}

async function handleGetOriginalUrl(req,res) {
    try{
        const {shortID} = req.params;

        const urlRecord =  await URL.findOne({shortID});
        if(!urlRecord) return res.status(404).json({error : "Short URL not found"})

        urlRecord.visitHistory.push({
            timestamp : Date.now(),
            ip : req.ip,
            userAgent : req.headers["user-agent"],
            referrer : req.get("Referrer") || "Direct"
        });

        await urlRecord.save();

        res.redirect(urlRecord.redirectedURL);
    }
    catch(error){
        console.log(error);
        res.status(500).json({error : "Could not redirect"})
    }
}

async function handleGetShortUrlPrivate(req,res) {
    try {
        const { redirectedURL, ttl } = req.body; // optional TTL in hours

        // Generate a simple random short ID
        let shortID;
        let isDuplicate = true;
        do{
            shortID = Math.random().toString(36).substring(2, 8);
            const existingURL = await URL.findOne({ shortID });
            if (!existingURL) {
                isDuplicate = false;
            }
        }while(isDuplicate);
        
        // Set expiry dynamically: either provided TTL or default 24 hours
        const expiresAt = ttl 
            ? new Date(Date.now() + ttl * 60 * 60 * 1000)
            : new Date(Date.now() + 24 * 60 * 60 * 1000);

        const newURL = await URL.create({
            shortID,
            redirectedURL,
            userID: req.user.id,
            visitHistory: [],
            expiresAt
        });

        res.json(newURL);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not create short URL" });
    }
}

async function handleGetShortUrlPublic(req,res) {
        try {
        const { redirectedURL, ttl } = req.body; // optional TTL in hours

        // Generate a simple random short ID
        let shortID;
        let isDuplicate = true;
        do{
            shortID = Math.random().toString(36).substring(2, 8);
            const existingURL = await URL.findOne({ shortID });
            if (!existingURL) {
                isDuplicate = false;
            }
        }while(isDuplicate);
        
        // Set expiry dynamically: either provided TTL or default 24 hours
        const expiresAt = ttl 
            ? new Date(Date.now() + ttl * 60 * 60 * 1000)
            : new Date(Date.now() + 24 * 60 * 60 * 1000);

        const newURL = await URL.create({
            shortID,
            redirectedURL,
            visitHistory: [],
            expiresAt
        });

        res.json(newURL);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not create short URL" });
    }
}

module.exports = {handleMyUrls, handleGetOriginalUrl, handleGetShortUrlPrivate, handleGetShortUrlPublic}