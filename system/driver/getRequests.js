var mongoose = require('mongoose');
var Request = mongoose.model("Request");

module.exports = function(req,res) {

    if(req.level !== 0)
	{
		res.status(401).json({"error": "You are not authorized to view this page."});
	}
	else
	{
		Request
		.find({driverUserId: req.userid, carId: req.params.carId})
		.exec(function(err, data) {
			if(err)	{
				console.log(err);
				res.status(500).json({"error": "Internal Server Error. Please try again later"});
			}
			else {
				console.log("GET Driver Requests' data");
				res.status(200).json(data);
			}
		});
	}
	
};