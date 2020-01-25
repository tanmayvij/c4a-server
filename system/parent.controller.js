var mongoose = require('mongoose');
var Parent = mongoose.model("Parent");
var aws = require('./aws.controller');
var Request = mongoose.model("Request");
var Query = mongoose.model("Query");

module.exports.getChild = function(req,res) {

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

module.exports.getOne = function(req,res,next) {

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

module.exports.addChild = function(req, res) {
	
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
				console.log("ADD new child");
				req.body.id = mongoose.Types.ObjectId();
				req.body._id = req.body.id;
				data.child.push(req.body);
				data.save();
				
				res.status(201).json({success: true});
			}
		});
	}
};


module.exports.saveRequest = function(req, res) {
	
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
	.create(newEntry, function(err, response) {
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

module.exports.saveQuery = function(req, res) {
	var newEntry, statusCode, returnData;
	
	newEntry = {
		parentUserId: req.userid,
		parentName: req.username,
		childName: req.body.childName,
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
	
	Query
	.create(newEntry, function(err, response) {
		if(err) {
            console.log("Error saving query: " + err)
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