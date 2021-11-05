const Mongoose = require("mongoose");
const _CONF = require('../common/config');
var jwt = require('jsonwebtoken');
const { options } = require("../router/home.router");
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
PersonModel.join = function(body,result){
    try {
        var person = new PersonModel(body);
        const User = person.save();
        result(person);
    } catch (error) {
        result(error);
    }
    
};
PersonModel.list =  function(result){
    PersonModel.find({},function(err,data){
        if(err) result(err)
        result(data)
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