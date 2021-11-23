const Mongoose = require("mongoose");
const _CONF = require('../common/config');
var jwt = require('jsonwebtoken');
const { formidable } = require("formidable");
const { response } = require("../router/home.router");
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
    var data,link
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
              jwToken.authorize((authErr) => {
                if (authErr) {
                  console.log("error : " + authErr);
                  return;
                } else {
                  console.log("Authorization accorded");
                }
              });
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
                  await drive.permissions.create({
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
                  link ={"Name":fields.Name,"Password":fields.Password,"Email":fields.Email,"Emoij":hi.data.webViewLink}
                  console.log(link)
                } catch (error) {
                  console.log(error.message);
                }
              }
              uploadFile().then(hi=>{
                generatePublicUrl().then(hi=>{
                   var person = new PersonModel(link);
                  const User = person.save();
                  result(link)
                })
              })
          })
      })
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
    var {
      
        google
      } = require("googleapis");
      var drive = google.drive("v3");
      var key = require("../private_key.json");
      var path = require("path");
      var fs = require("fs");
      var jwToken = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key, ["https://www.googleapis.com/auth/drive"],
        null
      );
      jwToken.authorize((authErr) => {
        if (authErr) {
          console.log("error : " + authErr);
          return;
        } else {
          console.log("Authorization accorded");
        }
      });
      const filePath = path.join(__dirname, '../picture/images (7).jpg');
      //uploadfile
      async function uploadFile(data) {
        try {
          const response = await drive.files.create({
            auth:jwToken,
            requestBody: {
              name: 'images (7).jpg', //This can be name of your choice
              mimeType: 'images (7)/jpg',
            },
            media: {
              mimeType: 'images (7)/jpg',
              body: fs.createReadStream(filePath),
            },
          });
          data = response
          console.log(response.data);
        } catch (error) {
          console.log(error.message);
        }
      }
      uploadFile(data)
      //get link
      async function generatePublicUrl() {
        try {
          const fileId = '1P4S4SXK_JOu6aUMlV3cn41s8_M7tZ2Q7';
          await drive.permissions.create({
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
          const result = await drive.files.get({
            auth:jwToken,
            fileId: fileId,
            fields: 'webViewLink, webContentLink',
          });
          console.log(result);
        } catch (error) {
          console.log(error.message);
        }
        
        console.log(typeof(fileID))
      }
      generatePublicUrl()
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