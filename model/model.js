const Mongoose = require("mongoose");
const _CONF = require('../common/config');
var jwt = require('jsonwebtoken');
const { formidable, Formidable } = require("formidable");
const { config } = require("dotenv");
const { file } = require("googleapis/build/src/apis/file");
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
  link ={"Name":req.body.Name,"Password":req.body.Password,"Email":req.body.Email,"Phonenumber":req.body.Phonenumber,"Address":req.body.Address}
  var person = new PersonModel(link);
  const User = person.save();
  result(link)
};

PersonModel.list =  function(req,result){
    const PAGE_SIZE = 5
    var trang = req.query.page
    if(trang){
        trang = parseInt(trang)
        if(trang<1)trang=1;
        var soluongskip = (trang-1)*PAGE_SIZE
        PersonModel.find({},function(err,data){
            if(err) result(err)
            result(data)
        }).skip(soluongskip).limit(PAGE_SIZE)
    }else{
        PersonModel.find({},function(err,data){
            if(err) result(err)
            result(data)
        })
    }

}
//upload Google Drive
PersonModel.test =  function(req,result){
  var data,link
  const parse = require('nodejs-base64-encode');
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
        var {
          google
        } = require("googleapis");
          var drive = google.drive("v3");
          var key = require("../private_key.json");
          var jwToken = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key, ["https://www.googleapis.com/auth/drive"],
            null
          );
          const filePath = path.join(files.Emoij.filepath);
          //uploadfile
          async function uploadFile() {
            try {
              const response = await drive.files.create({
                auth:jwToken,
                requestBody: {
                  name: picturename, //This can be name of your choice
                },
                media: {
                  body: fs.createReadStream(filePath),
                },
              });
              data=response.data
            } catch (error) {
              console.log(error.message);
            }
          }
          async function generatePublicUrl() {
            try {
              const fileId = data.id;
                drive.permissions.create({
                auth:jwToken,
                fileId: fileId,
                requestBody: {
                  role: 'reader',
                  type: 'anyone',
                },
              });
              /*
              webViewLink: View the file in browser
              webContentLink: Direct download link
              */
              const hi = await drive.files.get({
                auth:jwToken,
                fileId: fileId,
                fields: 'webViewLink, webContentLink',
              });
              a=parse.encode(hi.data.webViewLink,'base64')
              link ={"_id":fields._id,"Emoij":a}
            } catch (error) {
              console.log(error.message);
            }
          }
          uploadFile().then(hi=>{ 
            generatePublicUrl().then(hi=>{
              PersonModel.updateMany({_id:link._id },{ $set:{ Emoij:link.Emoij }},function(err,data){
                if(err)result(err)
              });
              result(link)
            })
          })
      })
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
    PersonModel.updateMany(query, { $set: {Password:body.password,Email:body.Email,Phonenumber:body.Phonenumber,Address:body.Address}}, function(err, data){
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