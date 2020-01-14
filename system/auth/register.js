var mongoose = require('mongoose');
var Parent = mongoose.model('Parent');
var Driver = mongoose.model("Driver");
var bcrypt = require("bcrypt-nodejs");

module.exports = function(req, res) {
    
    var newEntry, statusCode, returnData;
    if(!req.body.password)
    {
        resp = {
            'statusCode': 400,
            'error': "Password is required"
        };
        res
        .status(400)
        .json(resp);
        return;
    }
    var password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    if(parseInt(req.params.level) == 0)
    {
        console.log("New Driver registration")
        newEntry = {
            'userid' : req.body.userid,
            'name' : req.body.name,
            'email' : req.body.email,
            'phone' : req.body.phone,
            'password' : password,
            'imageUri': req.body.imageUri,
            'aadhar': req.body.aadhar,
            'license': req.body.license
        };
        Driver.create(newEntry, function(err, resp){
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
    else if(parseInt(req.params.level) == 1)
    {
        console.log("New Parent registration");    
        newEntry = {
            'userid' : req.body.userid,
            'name' : req.body.name,
            'email' : req.body.email,
            'phone' : req.body.phone,
            'password' : password,
            'imageUri': req.body.imageUri
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
            res
            .status(statusCode)
            .json(returnData);
        });
    }
    else
    {
        res.status(400).json({"error" : "bad request"});
    }
};
