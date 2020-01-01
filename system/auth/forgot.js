var mongoose = require('mongoose');
var Parent = mongoose.model('Parent');
var Driver = mongoose.model("Driver");
var nodemailer = require("nodemailer");
var nmconfig = require("../../config.json").nodemailer;

module.exports = function(req, res) {
    var level = req.params.level;
    var userid = req.body.userid;
    if(!level || (level !== 0 && level !== 1) || !userid) {
        res.status(400).json({"error" : "bad request"});
    }
    else if(level == 0) {
        console.log("Forgot password request for driver " + userid);
        Driver
        .findOne({
            userid: userid
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
				// Send email
				
				var transporter = nodemailer.createTransport(nmconfig);
				
				var mailOptions = {
					from: 'no-reply@example.com',
					to: user.email,
					subject: 'Password reset request',
					text: 'You have requested to reset your password. Please enter the following token on the reset page: ' + token
				};
				
				transporter.sendMail(mailOptions, function(error, info){
					if (error) {
						console.log(error);
						statusCode = 500;
						returnData = error;
						res.status(statusCode).json(returnData);
					}
					else {
						console.log('Email sent: ' + info.response);
						statusCode = 200;
						returnData = { "success" : "reset link sent" };
						res.status(statusCode).json(returnData);
					}
				});
			}
        });
    }
    else if(level == 1) {
        console.log("Forgot password request for parent " + userid);
        Parent
        .findOne({
            userid: userid
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
				// Send email
				
				var transporter = nodemailer.createTransport(nmconfig);
				
				var mailOptions = {
					from: 'no-reply@example.com',
					to: user.email,
					subject: 'Password reset request',
					text: 'You have requested to reset your password. Please enter the following token on the reset page: ' + token
				};
				
				transporter.sendMail(mailOptions, function(error, info){
					if (error) {
						console.log(error);
						statusCode = 500;
						returnData = error;
						res.status(statusCode).json(returnData);
					}
					else {
						console.log('Email sent: ' + info.response);
						statusCode = 200;
						returnData = { "success" : "reset link sent" };
						res.status(statusCode).json(returnData);
					}
				});
			}
        });
    }
};
