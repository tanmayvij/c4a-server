var mongoose = require('mongoose');
var Parent = mongoose.model('Parent');
var bcrypt = require("bcrypt-nodejs");

module.exports.register = function(req, res) {
    
    var newEntry, statusCode, returnData;
    if(!req.body.password)
    {
        resp = {
            'statusCode': 400,
            'returnData': "Password is required"
        };
        res
        .status(400)
        .json(resp);
        return;
    }
    var password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    newEntry = {
        'userid' : req.body.userid,
        'name' : req.body.name,
        'email' : req.body.email,
        'phone' : req.body.phone,
        'password' : password
    };
    Parent.create(newEntry, function(err, resp){
        if(err) {
            console.log("Error registering parent record : " + err)
            statusCode = 400;
            returnData = err;
        }
        else {
            statusCode = 201;
            returnData = resp;
        }
        resp = {
            'statusCode': statusCode,
            'returnData': returnData
        };
        res
        .status(statusCode)
        .json(resp);
    });
}