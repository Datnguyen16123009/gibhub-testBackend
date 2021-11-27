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