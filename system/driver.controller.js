var mongoose = require('mongoose');
var Driver = mongoose.model("Driver");

var runGeoQuery = function(req, res) {
	
	if (isNaN(req.query.lng) || isNaN(req.query.lat)) {
		res
		.status(400).
		json({"error": "Error 400: lat and lng should have floating point values."});
		return;
	}
	var lng = parseFloat(req.query.lng);
	var lat = parseFloat(req.query.lat);
	
	var point = {
		type: "Point",
		coordinates: [lng, lat]
	};
	var maxDist = 500;
	if(req.query.maxDist)
	{
		maxDist = (parseInt(req.query.maxDist, 10)*1000);
	}
	Driver
		.aggregate([
			{
				$geoNear: {
					near: point,
					spherical: true,
					maxDistance: maxDist,
					num: 5,
					distanceField: "dist.calculated"
				}
			}
		]).then( function(results) {
			if(results.length == 0 || !results)
			{
				res
					.status(404)
					.json({
					"error": "No drivers found"
				});
			}
			else {
				console.log('Geo Results', results);
				res
					.status(200)
					.json(results);
			}
		
        });
    };
module.exports.showAll = function(req,res) {

    var offset = 0;
	var count = 5;
	
	if(req.query && req.query.lat && req.query.lng)
	{
		runGeoQuery(req, res);
		return;
	}
	
	if(req.query && req.query.offset)
	{
		offset = parseInt(req.query.offset, 10);
	}
	if(req.query && req.query.count)
	{
		count = parseInt(req.query.count, 10);
	}
	
	if(isNaN(offset) || isNaN(count)) {
		res.status(400).json({"error" : "Error 400: count and offset should have integer values."});
		return;
	}
    
    Driver
	.find()
	.skip(offset)
	.limit(count)
		.exec(function(err, data) {
			if(err)	{
				console.log("Error finding drivers");
				res.status(500).json(err);
			}
			else {
				console.log("GET", count, "Drivers' data");
				res.status(200)
				.json(data);
			}
		});
	
};

module.exports.getCar = function(req,res) {

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

module.exports.addCar = function(req, res) {
	
	if(req.level !== 0)
	{
		res.status(401).json({"error": "You are not authorized to view this page."});
	}
	else
	{
		Driver
		.findOne({userid: req.userid})
		.exec(function(err, data) {
			if(err)	{
				console.log(err);
				res.status(500).json({"error": "Internal Server Error. Please try again later"});
			}
			else {
				console.log("ADD new car");
				req.body.id = mongoose.Types.ObjectId();
				req.body._id = req.body.id;
				data.car.push(req.body);
				data.save();
				
				res.status(201).json({success: true});
			}
		});
	}
};

module.exports.getOne = function(req,res,next) {

    if(req.level !== 0)
	{
		res.status(401).json({"error": "You are not authorized to view this page."});
	}
	else
	{
		Driver
		.findOne({userid: req.userid})
		.exec(function(err, data) {
			if(err)	{
				console.log(err);
				res.status(500).json({"error": "Internal Server Error. Please try again later"});
			}
			else {
				console.log("GET Driver's data");
				req.filepath = `driver/${data.imageUri.split('/').pop()}`;
				req.data = data;
				next();
			}
		});
	}
	
};