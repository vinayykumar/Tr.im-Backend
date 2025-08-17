const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`Server Started at Port: ${PORT}`)
})