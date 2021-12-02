var express = require('express');
var app = express();

var morgan = require('morgan')
const path = require('path');
const Mongoose = require("mongoose");
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
var homeRouter = require('./router/home.router');
app.use(morgan('common'))
Mongoose.connect("mongodb+srv://nguyentandat:datnguyen1612@cluster0.ftwyq.mongodb.net/Database?retryWrites=true&w=majority",function(err){
  if(err){
    console.log("Connect Failed")
  }else{
    console.log("Connect Success")
  }
});
app.use('/public',express.static(path.join(__dirname,'/public')))
app.use("/",homeRouter);

app.listen(3000,function(){
    console.log("Server is running in port 3000.....")
})
