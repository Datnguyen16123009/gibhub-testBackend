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
const filePath = path.join(newPath);
//uploadfile
var data
async function uploadFile() {
  try {
    const response = await drive.files.create({
      auth:jwToken,
      requestBody: {
        name: picturename, //This can be name of your choice
        mimeType: picturename,
      },
      media: {
        mimeType: picturename,
        body: fs.createReadStream(filePath),
      },
    });
    data=response.data
    result(response.data);
  } catch (error) {
    console.log(error.message);
  }
}
uploadFile()
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
    const result = await drive.files.get({
      auth:jwToken,
      fileId: fileId,
      fields: 'webViewLink, webContentLink',
    });
    result(result.data);
  } catch (error) {
    result(error.message);
  }
}
generatePublicUrl()




try {
  const user={"Name":fields.Name,"Password":fields.Password,"Email":fields.Email,"Emoij":picturename}
  var person = new PersonModel(user);
  const User = person.save();
  result(person);
} catch (error) {
  result(error);
}


jwToken.authorize((authErr) => {
  if (authErr) {
    console.log("error : " + authErr);
    return;
  } else {
    console.log("Authorization accorded");
  }
});


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
                  link ={"Name":fields.Name,"Password":fields.Password,"Email":fields.Email,"Emoij":a}
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


      var admin = require('firebase-admin');
  const path = require("path")
  var filename
  const {v1:uuidv1} = require("uuid")
  const form = new formidable.IncomingForm();
  const detect = require("detect-file-type")
  const firebaseConfig = {
    apiKey: "AIzaSyD-HeAgsOnw3lBaee6RlvLYmTqyeEdl7i4",
    authDomain: "nguyentandat-e6e1d.firebaseapp.com",
    projectId: "nguyentandat-e6e1d",
    storageBucket: "nguyentandat-e6e1d.appspot.com",
    messagingSenderId: "660811892513",
    appId: "1:660811892513:web:e62db114a7c3af98446060",
    measurementId: "G-H2YB5WFRBL"
  };
  form.parse(req, function (err, fields, files) {
    detect.fromFile(files.Emoij.filepath,(err,hi)=>{const picturename = uuidv1()+"."+hi.ext
    const allowimage = ["png","jeg","jpg"]
    if(!allowimage.includes(hi.ext)){
        result("Image not allowed") 
    }
    });
    filename= path.join(files.Emoij.filepath);
    console.log(filename)
    uploadFile()
  });
  async function uploadFile() {
    var serviceAccount = require("../private_key.json");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL:'https://nguyentandat-e6e1d.firebaseio.com'
    });
    // Error: firebase.storage is undefined, so not a function
    const bucket = admin.storage().bucket();
    bucket.upload(`${filename}`, {
      destination: 'img',

      gzip: true,
      metadata: {
        cacheControl: 'public, max-age=31536000'
      }
    }).then(() => {
      console.log('file uploaded.');
    }).catch(err => {
      console.error('ERROR:', err);
    });
  }