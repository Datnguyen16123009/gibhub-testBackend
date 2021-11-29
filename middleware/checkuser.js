const _CONF = require('../common/config')
const { formidable } = require("formidable");
const form = new formidable.IncomingForm()
const PersonModel = require("../model/model")
async function CheckUser(req,res,next) {
    username =  req.body.Name || req.query.Name || req.headers["x-access-Name"]||null;
    if(username==null){
        form.parse(req,(err,fields,files)=>{
            username=fields.Name
            PersonModel.find({Name:username},function(err,data){
                        if (data[0] != null){
                            return  res.status(401).json({"error": true, "message": 'User exits' });
                        }
                        next();
            })
        })
    }
  }
module.exports = CheckUser