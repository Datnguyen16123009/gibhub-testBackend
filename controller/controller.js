var DangNhap = require('../model/model');
exports.login = function(req,res){
    DangNhap.login(req.body.name,req.body.password,function(respone){
       res.send({result:respone});
    }); 
}
exports.join = function(req,res){
    DangNhap.join(req,function(respone){
       res.send({result:respone});
    }); 
}
exports.fake = function(req,res){
    DangNhap.fake(req.body,function(respone){
        res.send({result:respone})
    })
}
exports.home = function(req,res){
    const path = require('path');
    var pathfile = path.join(__dirname,'../home.html')
    res.sendFile(pathfile)
}
exports.test = function(req,res){
    DangNhap.test(req,function(respone){
        res.send({result:respone});
     }); 
}
exports.list = function(req,res){
    DangNhap.list(req,function(respone){
       res.json({result:respone});
    }); 
}
exports.detail = function(req,res){
    DangNhap.detail(req.body._id,function(respone){
       res.send({result:respone});
    }); 
}
exports.update = function(req,res){
    DangNhap.up(req.body._id,req.body,function(respone){
       res.send({result:respone});
    }); 
}
exports.delete = function(req,res){
    DangNhap.del(req.body._id,function(respone){
       res.send({result:respone});
    }); 
}