const express = require('express');
const userRouter = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const hashPass= (inputPass)=>{
      const salt =  bcrypt.genSaltSync(10);
      const hash =  bcrypt.hashSync(inputPass,salt); 
      return hash;
}
//loading the multer lib
const multer = require('multer');
const base_url = require("../base_url");
const uploadStorage = multer.diskStorage({
    destination:"./public/uploads/",
    filename:(req,file,cb)=>{
        cb(null, Date.now()+"-"+file.originalname);
    }

});
const upload = multer({storage:uploadStorage});

const userModel = require("../model/users.model");
userRouter.post("/signup",upload.single("avatar"),async(req,res)=>{
       try{
           const user= await userModel.insertOne({
                   "name" : req.body.name,
                   "email": req.body.email,
                   "pass1":  hashPass(req.body.pass1),
                   "profile_pic": base_url+req.file.filename,
                   "security_question":req.body.sq,
                   "security_ans"     : req.body.sa
              });
           if(!user){
              res.status(200).json({"message":"error while signup"+error.message});
           }else{
              res.status(200).json({"message":"user signup successfull"});
           }   

       }catch(error){
        console.log(error);
        res.status(200).json({"message":"Email is Already registered with US !"});
       }
});
userRouter.post("/changepass",async(req,res)=>{
        let email = req.body.email;
        const user = await userModel.findOne({"email":email}).exec();
        if(!user){
            res.status(200).json({"message":"user not registered with us !"});
        }else {
            //if user found then we need to match with sq and sa
            let security_question= req.body.sq;
            let security_ans     = req.body.sa;
            const obj1 =await userModel.find({
                $and:[
                    {"security_question":security_question},
                    {"security_ans":security_ans}
                ]
            });
            if(!obj1[0]){
                res.status(200).json({"message":"Invalid Operations Aborted...."});
            }else{
                  //Security answer is given correctly.
                 const obj2= await userModel.updateOne({"email":email},{$set:{"pass1":hashPass(req.body.pass1)}});
                 if(!obj2) res.status(200).json({"message":"unable to reset new Password"});
                 else res.status(200).json({"message":'password reset successfully Please login to continue'});

            }
           // res.status(200).json(obj1);
        }
        

});
userRouter.post("/signin",async(req,res)=>{
    try{ 
          const user = await userModel.findOne({"email":req.body.email}).exec();
          if(!user){
              res.status(200).json({"message":"no such email found"});
          }else{
            //res.status(200).json(user.pass1);
            let db_pass = user.pass1;
            let isMatch = bcrypt.compareSync(req.body.pass1,db_pass) ? true : false;
            if(isMatch){
                //Login Valid 
                //then create the jwt token for protecting the route
                const token = jwt.sign(
                                        {"user_id":user._id},//payload or data
                                        process.env.JWT_SECRET,//secretorPrivateKey random string
                                        {expiresIn:'1h'} //options expiration time 
                                      );
                res.status(200).json({"message":"login successfull","user":user,"token":token});
            }else{
                res.status(200).json({"message":"Wrong Credentials"});
            }
          }
    }catch(error){
        res.status(403).json(error);
    }
})

module.exports = userRouter;
console.log("user router is working");