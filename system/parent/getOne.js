var mongoose = require('mongoose');
var Parent = mongoose.model("Parent");

module.exports = function(req,res,next) {

    if(req.level !== 1)
	{
		res.status(401).json({"error": "You are not authorized to view this page."});
	}
	else
	{
		Parent
		.findOne({userid: req.userid})
		.exec(function(err, data) {
			if(err)	{
				console.log(err);
				res.status(500).json({"error": "Internal Server Error. Please try again later"});
			}
			else {
				console.log("GET Parent's data");
				req.filepath = `parent/${data.imageUri.split('/').pop()}`;
				req.data = data;
				next();
			}
		});
	}
	
};