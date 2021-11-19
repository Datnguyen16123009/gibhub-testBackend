var express = require('express');
const  checktoken = require('../middleware/checktoken')
var router = express();
var homecontroller = require('../controller/controller')


router.get('/' ,homecontroller.home);
router.post("/login",homecontroller.login);
router.post("/join",homecontroller.join);
router.post("/test",homecontroller.test);
router.get("/list",checktoken,homecontroller.list);
router.get("/detail",checktoken,homecontroller.detail);
router.patch("/update",checktoken,homecontroller.update);
router.delete("/delete-user",checktoken,homecontroller.delete);
module.exports = router;
