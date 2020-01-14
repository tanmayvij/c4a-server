const jwt = require("jsonwebtoken");
const jwtkey = require("../../config.json").jwtkey;
const mongoose = require("mongoose");

module.exports = function(req, res, next) {
	var headerExists = req.headers.authorization;
	if(headerExists)
	{
		var token = req.headers.authorization;
		jwt.verify(token, jwtkey, function(err, decoded){
			if(err)
			{
				console.log(err);
				res.status(401).json({'error' : 'auth failed'});
			}
			else
			{
				req.userid = decoded.userid;
				req.level = decoded.level;
				req.username = decoded.username;
				next();
			}
		});
	}
	else
	{
		console.log('No token provided');
		res.status(401).json({'error' : 'no token provided'});
	}
};