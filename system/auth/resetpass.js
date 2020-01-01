const mongoose = require("mongoose");
const Parent = mongoose.model("Parent");
const Driver = mongoose.model("Driver");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const jwtkey = require("../../config.json").jwtkey;

module.exports = function(req, res) {
    var level = parseInt(req.params.level);
    var userid = req.query.userid;
    var token = req.query.token;
    if((level !== 0 && level !== 1) || !userid || !token) {
        res.status(400).json({"error" : "bad request"});
    }
    else if(level == 0) {
        Driver
        .findOne({
			userid : userid
		})
		.exec(function(err, data) {
			if(err)	{
					console.log("Error getting user");
					res.status(500).json(err);
			}
			else {
				if(!data)
				{
					res.status(404).json({
						"error": "User not found"
					});
				}
				else {
					console.log("Reset password", userid);
					
					// Verify token
					if(token == data.token)
					{
						// Generate new password					
						var temp = "";
						var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
						for (var i = 0; i < 10; i++)
						{
							temp += possible.charAt(Math.floor(Math.random() * possible.length));
						}	
						
						var password = bcrypt.hashSync(temp, bcrypt.genSaltSync(10));
						
						// Update password & remove token in database
						data.password = password;
						data.token = undefined;
						data.save(function(err, result){
							if(err)
							{
								res.status(500).json(err);
							}
							else {
								res.status(200).json({ 'newPassword' : temp });
							}
						});
					}
					else
					{
						res
						.status(401)
						.json({"error" : "invalid token"});
					}
				}
			}
		});
    }
    else if(level == 1) {
        Parent
        .findOne({
			userid : userid
		})
		.exec(function(err, data) {
			if(err)	{
					console.log("Error getting user");
					res.status(500).json(err);
			}
			else {
				if(!data)
				{
					res.status(404).json({
						"error": "User not found"
					});
				}
				else {
					console.log("Reset password", userid);
					
					// Verify token
					if(token == data.token)
					{
						// Generate new password					
						var temp = "";
						var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
						for (var i = 0; i < 10; i++)
						{
							temp += possible.charAt(Math.floor(Math.random() * possible.length));
						}	
						
						var password = bcrypt.hashSync(temp, bcrypt.genSaltSync(10));
						
						// Update password & remove token in database
						data.password = password;
						data.token = undefined;
						data.save(function(err, result){
							if(err)
							{
								res.status(500).json(err);
							}
							else {
								res.status(200).json({ 'newPassword' : temp });
							}
						});
					}
					else
					{
						res
						.status(401)
						.json({"error" : "invalid token"});
					}
				}
			}
		});
    }
}