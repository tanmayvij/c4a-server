var mongoose = require('mongoose');
var Parent = mongoose.model('Parent');
var Driver = mongoose.model("Driver");
var nodemailer = require("nodemailer");
var nmconfig = require("../../config.json").nodemailer;
const fetch = require('node-fetch');

module.exports = function(req, res) {
    var level = parseInt(req.params.level);
    var userid = req.body.userid;
    if((level !== 0 && level !== 1) || !userid) {
        res.status(400).json({"error" : "bad request"});
    }
    else if(level == 0) {
        console.log("Forgot password request for driver " + userid);
        Driver
        .findOne({
            $or: [
				{userid: userid},
				{email: userid}
			]
        })
        .exec(function(err, user){
            if(err) {
                console.log(err);
                res.status(500).json(err);
            }
            else if(!user) {
                console.log("Failed: User does not exist")
                res.status(404).json({"error" : "User does not exist"})
            }
            else {
                var statusCode = 200, returnData = "";
				// Generate token
				var token = "";
				var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
				for (var i = 0; i < 32; i++)
				{
					token += possible.charAt(Math.floor(Math.random() * possible.length));
				}
				// Update token in database
				user.token = token;
				user.save(function(err, result){
					if(err)
					{
						statusCode = 500;
						returnData = err;
					}
				});
				if(statusCode == 500) {
					res.status(statusCode).json(returnData);
					return;
				}
				// Send message
				
				fetch(`${require('../../config.json').msgApiUrl}?test=1&
                    apikey=${require('../../config.json').msgApiKey}
                    &message=Your verification code to reset your Cab4All password is ${token}.
                    &numbers=${user.phone.substring(1)}`,
                    {method: 'GET'})
                    .then((response) => response.json())
                    .then((response) => {
                        if(response.status == 'success')
                        {   
                            console.log('Message sent');
							statusCode = 200;
							returnData = { "success" : true };
							res.status(statusCode).json(returnData);
                        }
                        else
                        {
                            console.log({"error": JSON.stringify(response)});
							statusCode = 500;
							returnData = { "error" : "Uh-oh! Something went wrong while sending the verification code SMS to your mobile number. Please try again later." };
							res.status(statusCode).json(returnData);
                        } 
                    }
                );
			}
        });
    }
    else if(level == 1) {
        console.log("Forgot password request for parent " + userid);
        Parent
        .findOne({
            $or: [
				{userid: userid},
				{email: userid}
			]
        })
        .exec(function(err, user){
            if(err) {
                console.log(err);
                res.status(500).json(err);
            }
            else if(!user) {
                console.log("Failed: User does not exist")
                res.status(404).json({"error" : "User does not exist"})
            }
            else {
                var statusCode = 200, returnData = "";
				// Generate token
				var token = "";
				var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
				for (var i = 0; i < 6; i++)
				{
					token += possible.charAt(Math.floor(Math.random() * possible.length));
				}
				// Update token in database
				user.token = token;
				user.save(function(err, result){
					if(err)
					{
						console.log(err);
						statusCode = 500;
						returnData = { "error" : "Uh-oh! Something went wrong while sending the verification code SMS to your mobile number. Please try again later." };
					}
				});
				if(statusCode == 500) {
					res.status(statusCode).json(returnData);
					return;
				}
				// Send message
				
				fetch(`${require('../../config.json').msgApiUrl}?test=1&
                    apikey=${require('../../config.json').msgApiKey}
                    &message=Your verification code to reset your Cab4All password is ${token}.
                    &numbers=${user.phone.substring(1)}`,
                    {method: 'GET'})
                    .then((response) => response.json())
                    .then((response) => {
                        if(response.status == 'success')
                        {   
                            console.log('Message sent');
							statusCode = 200;
							returnData = { "success" : true };
							res.status(statusCode).json(returnData);
                        }
                        else
                        {
                            console.log({"error": JSON.stringify(response)});
							statusCode = 500;
							returnData = { "error" : "Uh-oh! Something went wrong while sending the verification code SMS to your mobile number. Please try again later." };
							res.status(statusCode).json(returnData);
                        } 
                    }
                );
			}
        });
    }
};