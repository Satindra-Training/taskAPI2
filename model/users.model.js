const mongoose = require('mongoose');

//Adding Server side validations.
const usersSchema = mongoose.Schema({
      "name":{
          type:String,
          required:[true,"name is Required"],
          validate:{
            validator:(nameValue)=>{
                 return (/^[A-Za-z\s]{3,12}$/).test(nameValue);
            },
            message:(props)=>`${props.value} is Invalid must contains letters min 3 to max 12 chars long`
          }
      },
      "email":{
           type:String,
           required:[true,"email is required"],
           unique:true,
           validate:{
            validator:(emailValue)=>{
                  return (/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(emailValue);
            },
            message:(props)=>`${props.value} is Invalid email`
           }
      },
      "profile_pic":{
           type:String,
           required:[true,"profile pic path is required"]
      },
      "pass1":{
          type:String,
          required:[true,"Password is Required"],
           
      },
      "role":{
           type:String,
           default:'regular'
      },
      "security_question":{
           type:String,
           required:[true,'security question is required']
      },
      "security_ans":{
          type:String,
          required:[true,'security_ans is required']
      }
},{versionKey:false});

module.exports=
mongoose.model("userModel",usersSchema,"users");
console.log("userModel is working");

