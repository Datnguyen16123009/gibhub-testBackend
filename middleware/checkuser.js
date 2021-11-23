const _CONF = require('../common/config')
const Mongoose = require("mongoose");
const PersonModel = Mongoose.model("people", {
    Password: String,
    Name:String,
    Email:String,
    Phonenumber:String,
    Address:String,
    Emoij:String
});
function CheckUser(req,res,next) {
    username =  req.body.Name || req.query.Name || req.headers["x-access-Name"];
    PersonModel.find({Name:username},function(err,data){
        if (data == null){
            console.log(data)
            res.json("Name existed")
        }
        else{
            next();
        }
    })
  }
module.exports = CheckUser