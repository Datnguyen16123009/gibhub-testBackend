const Mongoose = require("mongoose");
const _CONF = require('../common/config');
var jwt = require('jsonwebtoken');
const { options, patch } = require("../router/home.router");
const { formidable, Formidable } = require("formidable");
const { decode } = require("punycode");
const PersonModel = Mongoose.model("person", {
    Password: String,
    Name:String,
    Email:String,
    Phonenumber:String,
    Address:String,
    Emoij:String
});

PersonModel.login = function(name,pass,result){
    // Kiểm tra email có tồn tại hay không
    PersonModel.find({ Name:name, Password:pass},function (err, docs) {
        if(err) result(err)
        if(docs[0]==null) result("User not found")
        else {
            let user = {
                "username": name,
                "password": pass
            }
            const token = jwt.sign(user, _CONF.SECRET, { expiresIn: _CONF.tokenLife });
            const response = {
                    "token":token,
                    }
            result(response)
        }
    });
};
PersonModel.join = function(req,result){
    const form = new formidable.IncomingForm()
    const detect = require("detect-file-type")
    const {v1:uuidv1} = require("uuid")
    const fs = require("fs")
    const path = require("path")
    form.parse(req,(err,fields,files)=>{
        if(err){return("ERR in file")}
        detect.fromFile(files.Emoij.filepath,(err,hi)=>{
            const picturename = uuidv1()+"."+hi.ext
            const allowimage = ["png","jeg","jpg"]
            if(!allowimage.includes(hi.ext)){
                result("Image not allowed") 
            }
            const oldPath = files.Emoij.filepath
            const newPath = path.join(__dirname,"..","..","Test","picture", picturename)
            fs.rename(oldPath,newPath,err=>{
                if(err) result(err)
                try {
                    const user={"Name":fields.Name,"Password":fields.Password,"Email":fields.Email,"Emoij":picturename}
                    var person = new PersonModel(user);
                    const User = person.save();
                    result(person);
                } catch (error) {
                    result(error);
                }
            })
        })
    })
};
PersonModel.list =  function(result){
    PersonModel.find({},function(err,data){
        if(err) result(err)
        result(data)
    })
}
PersonModel.test =  function(req,result){
    const form = new formidable.IncomingForm()
    const detect = require("detect-file-type")
    const { base64encode, base64decode } = require('nodejs-base64');
    form.parse(req,(err,fields,files)=>{
        data=fields.image
        he = fields._id
        encoded = base64encode(data);
        decoded = base64decode(encoded)
        PersonModel.updateOne({_id:he}, { $set: {Emoij:encoded}}, function(err, hi){
            if(err) result(err)
            PersonModel.find({_id:he},function(err,data){
                if(err) result(err)
                if(data){result("User Not Found")}
                else{result(data)}
            })
        });
    
    })
}
PersonModel.detail =  function(id,result){
    PersonModel.find({_id:id},function(err,data){
        console.log(data)
        if(err) result(err)
        result(data)
    })
}
PersonModel.up =  function(id,body,result){
    const query = { _id: id };
    console.log(id)
    console.log(body.password)
    console.log(body.name)
    PersonModel.updateMany(query, { $set: {Password:body.password,Name:body.name,Email:body.Email,Phonenumber:body.Phonenumber,Address:body.Address}}, function(err, data){
        if(err) result(err)
        PersonModel.find({_id:id},function(err,data){
            console.log(data)
            if(err) result(err)
            result(data)
        })
    });
}
PersonModel.del =  function(id,result){
    PersonModel.find({_id:id},function(err,data){
        if(data==null){
            result("User Not Found")
        }else{
            PersonModel.deleteMany({_id:data[0].id ,Password:data[0].Password,Name:data[0].Name,Email:data[0].Email,Phonenumber:data[0].Phonenumber,Address:data[0].Address,Emoij:data[0].Emoij },function(err,ketqua){
                if(err)result(err)
                if(ketqua.deletedCount==0){
                    result("Delete Failed")
                }else{
                    result("Delete Successfully")
                }
            });
        }
       
    })
}
module.exports = PersonModel;