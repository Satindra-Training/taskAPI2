const mongoose = require("mongoose");
const taskSchema = mongoose.Schema({
      "title":{
           type:String,
           required:[true,'task title is mandate']
      },
      "description":{
           type:String,
           required:[true,"descrition is required"]
      },
      "created_at":{
          type:Date,
          required:[true,"created is required"],
          default : new Date()
      },
      "user_id":{
            type:mongoose.Types.ObjectId,
            ref:"userModel"
      }
},{versionKey:false});//This will not generate __v versionkey

module.exports=
mongoose.model("taskModel",taskSchema,"tasks");
              //Virtual    //schema   //collections
console.log("task model is working");