var mongoose = require('mongoose');
var Driver = mongoose.model("Driver");

module.exports = function(req,res) {

    if(req.level !== 0)
	{
		res.status(401).json({"error": "You are not authorized to view this page."});
	}
	else
	{
		Driver
		.findOne({userid: req.userid})
		.select('car -_id')
		.exec(function(err, data) {
			if(err)	{
				console.log(err);
				res.status(500).json({"error": "Internal Server Error. Please try again later"});
			}
			else {
				console.log("GET Car data");
				res.status(200)
				.json(data.car);
			}
		});
	}
	
};