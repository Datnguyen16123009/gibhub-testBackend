const jwt = require('jsonwebtoken')
const _CONF = require('../common/config')
function CheckToken(req,res,next) {
  token =  req.body.token || req.query.token || req.headers["x-access-token"];
  jwt.verify(token, _CONF.SECRET, function(err, decoded) {
    if (err) {
        //if (err) throw new Error(err)
        return res.status(401).json({"error": true, "message": 'Unauthorized access.', err });
    }
    next();
  });
}
module.exports = CheckToken