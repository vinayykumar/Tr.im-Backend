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
const {connectMongoDB} = require('./connection')

connectMongoDB(process.env.DB_URL)

//Middlewares
app.use(cors({ origin: "*", credentials: true })); 
// app.use(cors({ origin: "http://your-frontend.com", credentials: true })); 
app.use(express.json());
// (Optional) if you also need form data
app.use(express.urlencoded({ extended: true }));
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