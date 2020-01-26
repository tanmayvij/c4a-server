var mongoose = require('mongoose');
var Request = mongoose.model("Request");

module.exports = function(req, res) {
	
	var newEntry, statusCode, returnData;
	
	newEntry = {
		parentUserId: req.userid,
		parentName: req.username,
		childName: req.body.childName,
		driverUserId: req.body.driverUserId,
		carId: req.body.carId,
		pickup: {
			address: req.body.pickupAddress,
			coordinates: [
				parseFloat(req.body.pickupLng),
				parseFloat(req.body.pickupLat)
			]
		},
		institution: {
			name: req.body.institution,
			coordinates: [
				parseFloat(req.body.institutionLng),
				parseFloat(req.body.institutionLat)
			]
		}
	};
	
	Request
	.create(newEntry, function(err) {
		if(err) {
            console.log("Error saving request: " + err)
            statusCode = 500;
            returnData = {error: err};
        }
        else {
			statusCode = 500;
            returnData = {success: true};
		}
		res.status(statusCode).json(returnData);
	});
}