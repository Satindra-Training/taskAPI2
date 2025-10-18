const express = require("express");
const cors    = require('cors');
const mongoose = require("mongoose");
const env = require('dotenv').config();

mongoose.connect(process.env.MONGO_ATLAS)
        .then(()=>{
            console.log("Atlas MongoDB Connected");
        }).catch((error)=>{
            console.log(error);
        })
const host=process.env.HOST;
const port= process.env.PORT;
const taskRouter = require("./routes/tasks.routes");
const userRouter = require("./routes/users.routes");
const app = express();
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));//Server static resource make them available to frontend application
app.use("/api/tasks",taskRouter);
app.use("/api/users",userRouter);
app.get("/",(req,res)=>{
      res.send("<h1>Welcome to TaskAPI2</h1>");
});

app.listen(port,host,()=>{
    console.log(`Express server has started at http://${host}:${port}/`);
});
