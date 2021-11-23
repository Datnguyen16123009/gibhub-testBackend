var {google} = require("googleapis");
const path = require('path')
var drive = google.drive("v3");
var key = require("../private_key.json");
const newPath = path.join(__dirname,"..","..","Test","picture", picturename)
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
    link = hi
    console.log(link.data)
} catch (error) {
    console.log(error.message);
}
}
module.exports = {uploadFile,generatePublicUrl}