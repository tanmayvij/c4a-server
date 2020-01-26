var mongoose = require('mongoose');
var Parent = mongoose.model("Parent");

module.exports = function(req,res) {

    if(req.level !== 1)
	{
		res.status(401).json({"error": "You are not authorized to view this page."});
	}
	else
	{
		Parent
		.findOne({userid: req.userid})
		.select('child -_id')
		.exec(function(err, data) {
			if(err)	{
				console.log(err);
				res.status(500).json({"error": "Internal Server Error. Please try again later"});
			}
			else {
				console.log("GET Children's data");
				res.status(200)
				.json(data.child);
			}
		});
	}
	
};