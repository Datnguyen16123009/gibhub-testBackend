var express = require('express');
const  checktoken = require('../middleware/checktoken')
var router = express();
var homecontroller = require('../controller/controller')
const path = require("path");
const CheckUser = require('../middleware/checkuser');

router.get('/' ,homecontroller.home);
router.get('/home',(req,res,next)=>{
    res.sendFile(path.join(__dirname,'../home.html'))
});
router.post("/login",homecontroller.login);
router.post("/join",CheckUser,homecontroller.join);
router.post("/fake",homecontroller.fake);
router.post("/test",homecontroller.test);
router.get("/list",checktoken,homecontroller.list);
router.get("/detail",checktoken,homecontroller.detail);
router.patch("/update",CheckUser,checktoken,homecontroller.update);
router.delete("/delete-user",checktoken,homecontroller.delete);
module.exports = router;
