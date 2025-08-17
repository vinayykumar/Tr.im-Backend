const mongoose = require('mongoose')

//Schema Creation
const urlSchema = new mongoose.Schema({
    userID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    shortID : {
        type : String,
        required : true,
        index : true
    },
    redirectedURL : {
        type : String,
        required : true
    },
    visitHistory: [{
        timestamp: { type: Number, required: true },
        ip: String,          // IP address
        userAgent: String,   // browser
        referrer: String     // where click came from
    }],
},{timestamps : true});



//Indexes
urlSchema.index({shortID:1});
urlSchema.index({expiresAt:1}, {expireAfterSeconds:0})

//Model Creation
const URL = mongoose.model('url',urlSchema)

module.exports = URL;