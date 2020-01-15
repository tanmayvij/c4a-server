const mongoose = require("mongoose");
const Parent = mongoose.model("Parent");
const Driver = mongoose.model("Driver");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const jwtkey = require("../../config.json").jwtkey;

module.exports = function(req, res) {
    var level = parseInt(req.params.level);
    var userid = req.body.userid;
    var token = req.body.token;
	var newPassword = req.body.password;
    if((level !== 0 && level !== 1) || !userid || !token) {
        res.status(400).json({"error" : "bad request"});
    }
    else if(level == 0) {
        Driver
        .findOne({
			$or: [
				{userid: userid},
				{email: userid}
			]
		})
		.exec(function(err, data) {
			if(err)	{
					console.log("Error getting user");
					res.status(500).json({"error": "Uh-oh! Something's not right. Please try again later."});
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
						
						var password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
						
						// Update password & remove token in database
						data.password = password;
						data.token = undefined;
						data.save(function(err, result){
							if(err)
							{
								res.status(500).json({"error": "Uh-oh! Something's not right. Please try again later."});
							}
							else {
								res.status(200).json({ 'success': true });
							}
						});
					}
					else
					{
						res
						.status(401)
						.json({"error" : "Invalid code. Please try again."});
					}
				}
			}
		});
    }
    else if(level == 1) {
        Parent
        .findOne({
			$or: [
				{userid: userid},
				{email: userid}
			]
		})
		.exec(function(err, data) {
			if(err)	{
					console.log("Error getting user");
					res.status(500).json({"error": "Uh-oh! Something's not right. Please try again later."});
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
						
						var password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
						
						// Update password & remove token in database
						data.password = password;
						data.token = undefined;
						data.save(function(err, result){
							if(err)
							{
								res.status(500).json({"error": "Uh-oh! Something's not right. Please try again later."});
							}
							else {
								res.status(200).json({ 'success': true});
							}
						});
					}
					else
					{
						res
						.status(401)
						.json({"error" : "Invalid code. Please try again."});
					}
				}
			}
		});
    }
}