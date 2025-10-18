const jwt = require('jsonwebtoken');
const env = require('dotenv').config();
const checkAuth = (req,res,next)=>{
try{
    //From frontend token will be supplied as bearer token or auth params.
       //Bearer Token
       const token = req.headers['authorization'].split(" ")[1];
       //if token is missing 
       if(!token){
        return res.status(200).json({"message":"token is not supplied"});
    
       }
       const decoded =jwt.verify(token,process.env.JWT_SECRET);
       console.log(decoded.user_id);
       next(); //--> will go to next available resource

}catch(error){
      console.log(error);
      return res.status(200).json({"error":"Invalid JWT token or token has expired"}); 
}
}

module.exports=checkAuth;
console.log("auth middleware is working");
