const express = require('express');
const taskRouter = express.Router();
//consume taskModel
const taskModel = require("../model/tasks.model");
//cosuming the auth middleware for jwt protection
const checkAuth = require("../middleware/auth");

taskRouter.get("/showall",async(req,res)=>{
       
    const tasks  = await taskModel.find().populate("user_id").exec();
    res.status(200).json(tasks);

});
/*This is for admin stuff */
taskRouter.get("/all",checkAuth, async(req,res)=>{
    //res.status(200).json({"message":"hello"});
    try{
       const tasks = await taskModel.find().exec();
       res.status(200).json(tasks);
    }
    catch(error){
        console.log(error);
        res.status(403).json(error);
    }   
});

taskRouter.get("/show/:id",checkAuth, async(req,res)=>{
    //res.status(200).json({"message":"hello"});
    try{
       const tasks = await taskModel.findOne({"_id":req.params.id}).exec();
       res.status(200).json(tasks);
    }
    catch(error){
        console.log(error);
        res.status(403).json(error);
    }   
});

taskRouter.post("/add/:uid",checkAuth, async(req,res)=>{
    try{
      const task =  await taskModel.insertOne({
               title : req.body.title,
               description: req.body.description,
               user_id    : req.params.uid
        });
       if(!task){
           res.status(403).json({"message":"unable to add task"});
       }else{
           res.status(200).json({"message":"one task successfully added"});
       }  
    }
    catch(error){
        console.log(error);
    }
});

taskRouter.patch("/update/:tid",checkAuth, async(req,res)=>{
       try{
           const task= await taskModel.updateOne({
                  "_id":req.params.tid
             },{
                $set:{
                       title : req.body.title,
                       description:req.body.description
                }
             });

             if(!task){
                res.status(403).json({"message":"unbale to update task"});
             }else{
                res.status(200).json({"message":"task updated successfully"});
             }

       }catch(error){
              res.status(403).json(error);
       } 
});

taskRouter.delete("/delete/:tid",checkAuth, async(req,res)=>{
      try{
            const task = await taskModel.deleteOne({"_id":req.params.tid});
            if(!task){
                res.status(403).json({"message":"unable to delete task"});
            }else{
                res.status(200).json({"message":"task deleted successfully"});
            }
      }
      catch(error){
         res.status(403).json(error);
      }
})

module.exports= taskRouter;
console.log("task router is working");