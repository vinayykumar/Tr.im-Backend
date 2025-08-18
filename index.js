const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const PORT = process.env.PORT
const authRoutes = require('./routes/auth')
const urlRoutes = require('./routes/url')
const {globalLimiter} = require('./middlewares/ratelimiter')


app.use(globalLimiter);
app.use(express.json());
app.use('/api/auth',authRoutes)
app.use('/api/url',urlRoutes)


app.listen(PORT,()=>{
    console.log(`Server Started at Port: ${PORT}`)
})