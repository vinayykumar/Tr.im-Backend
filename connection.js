const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config();

async function connectMongoDB(url){
    //Dont Expose DB URL, store db url in env files
    // const dbUrl = 'mongodb://127.0.0.1:27017/mongodb_local_testlearn';
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ DB connection error:", err));
}

module.exports = {
    connectMongoDB,
};