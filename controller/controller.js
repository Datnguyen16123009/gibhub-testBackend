var DangNhap = require('../model/model');
exports.login = function(req,res){
    DangNhap.login(req.body.name,req.body.password,function(respone){
       res.send({result:respone});
    }); 
}
exports.join = function(req,res){
    DangNhap.join(req.body,function(respone){
       res.send({result:respone});
    }); 
}
exports.list = function(req,res){
    DangNhap.list(function(respone){
       res.send({result:respone});
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