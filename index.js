const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const authRoutes = require('./routes/auth')
const urlRoutes = require('./routes/url')
const {globalLimiter} = require('./middlewares/ratelimiter')
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");


//Middlewares
app.use(cors({ origin: "*", credentials: true })); 
// app.use(cors({ origin: "http://your-frontend.com", credentials: true })); 
app.use(helmet()); 
app.use(morgan("dev")); 
app.use(globalLimiter);

//Body parser
app.use(express.json());

//Routes
app.use('/api/auth',authRoutes)
app.use('/api/url',urlRoutes)


const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server Started at Port: ${PORT}`)
})