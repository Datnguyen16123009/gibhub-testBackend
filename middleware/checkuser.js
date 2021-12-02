const _CONF = require('../common/config')
const { formidable } = require("formidable");
const form = new formidable.IncomingForm()
const PersonModel = require("../model/model")
async function getusername(req,res){
    var a =await form.parse(req,(err,fields)=>{
        username=fields.Name
    });
}
async function CheckUser(req,res,next) {
    username =  req.body.Name || req.query.Name || req.headers["x-access-Name"]||null;
    if(username==null){
        getusername(req,res).then(hi=>{
            PersonModel.find({Name:username},function(err,data){
                if (data[0] != null){
                    return  res.status(401).json({"error": true, "message": 'User exits' });
                }
                next();
                })
        })
    }else{
        PersonModel.find({Name:username},function(err,data){
            if (data[0] != null){
                return  res.status(401).json({"error": true, "message": 'User exits' });
            }
            next();
            })
    }
    //next();
}
module.exports = CheckUser