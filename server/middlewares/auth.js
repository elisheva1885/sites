const jwt = require("jsonwebtoken")
const {config} = require('../config/secret')

exports.auth = async(req, res, next) =>{
    let token = req.header('x-auth-token');
    if(!token){
        return res.status(401).json({msg: "You need to send token to this endpoint url 6666"});
    }
    let tokenData;
    try{
        tokenData = jwt.verify(token, config.tokenSecret);
        req.user = tokenData;
        next();
    }
    catch(err){
        console.log(err);
        res.status(401).json({msg: "Token is not valid"});
    }
}