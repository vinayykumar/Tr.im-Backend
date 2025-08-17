const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({error : "Access Token Missing"});
    }

    jwt.verify(token,ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err) return res.status(403).json({error:"Invalid or Expired Token"});

        req.user = user; // attach decoded payload to request
        next();
    })
}


module.exports = authenticateToken;
