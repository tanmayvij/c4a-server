var mongoose = require('mongoose');
var Driver = mongoose.model("Driver");
var Request = mongoose.model("Request");
var Query = mongoose.model("Query");
const fetch = require('node-fetch');

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

module.exports.getRequests = function(req,res) {

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

module.exports.getQueries = function(req,res) {

		Query
		.aggregate([
			{
				$geoNear: {
					// Institution should be within 200 m of one of route's points and pickup point should be within 500 m.
				}
			}
		])
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
	
};

module.exports.acceptRequest = function(req,res,next) {

	if(!req.params.id)
	{
		res.status(400).json({"error": "Params missing"});
		return;
	}
	Request
	.aggregate([
		{
			$match: {
				_id: mongoose.Types.ObjectId( req.params.id),
				driverUserId: req.userid
			}
		},
		{
			$lookup: {
				from: 'parents',
				localField: 'parentUserId',
				foreignField: "userid",
				as: "parent"
			}
		},
		{
			$lookup: {
				from: 'drivers',
				localField: 'driverUserId',
				foreignField: "userid",
				as: "driver"
			}
		}
	])
	.exec(function(err, response) {
		if(err) {
			res.status(500).json({"error": "Something went wrong."});
		}
		else if(response.length == 0) {
			res.status(404).json({"error": "Request not found."});
		}
		else {
			var data = response[0];
			data.parent = response[0].parent[0];
			data.driver = response[0].driver[0];
			req.route = {
				child: data.childName,
				coordinates: data.pickup.coordinates
			};
			req.id = data.driver.userid;
			req.carId = data.carId;
			req.RequestId = data._id;
			var message = `
			Dear ${data.parent.name}, Your Cab4All request for ${data.childName} has been accepted by ${data.driver.name}. You can now contact the driver on ${data.driver.phone}. Thank you for using Cab4All.`;
			var params = {
					apikey: require('../../config.json').msgApiKey,
					message: message,
					numbers: data.parent.phone.substring(1)
				}
				var esc = encodeURIComponent;
				var query = Object.keys(params)
					.map(k => esc(k) + '=' + esc(params[k]))
					.join('&');
			fetch(require('../config.json').msgApiUrl + '?' + query,
                    {method: 'GET'})
                    .then((response) => response.json())
                    .then((response) => {
                        if(response.status == 'success')
                        {   
                            next();
                        }
                        else
                        {
                            console.log({"error": JSON.stringify(response)});
							statusCode = 500;
							returnData = { "error" : "Uh-oh! Something went wrong. Please try again later." };
							res.status(statusCode).json(returnData);
                        } 
                    }
                );
		}
	})
};

module.exports.updateRoute = function(req, res, next) {
	Driver
	.findOne({userid: req.id})
	.exec(function(err, result) {
		if(err) {
			res.status(500).json({"error": JSON.stringify(err)});
		}
		else {
			result.car.forEach(element => {
				if(element._id == req.carId) {
					element.route.push(req.route);
				}
			});
			result.save();
			req.id = req.RequestId;
			next();
		}
	})
}

module.exports.deleteRequest = function(req,res) {

	var id = req.id || req.params.id;
	if(!id)
	{
		res.status(400).json({"error": "Params missing"});
		return;
	}
	Request
	.deleteOne({_id: id})
	.exec(function(err, response) {
		if(err) {
			res.status(500).json({"error": "Something went wrong."});
		}
		else {
			res.status(200).json({"success" :true})
		}
	})
};

module.exports.contactOnQuery = function(req,res) {

	/* Send message to parent and log the event in db */
	
};

module.exports.searchCabs = function(req, res) {
	res.json(
	[
		{
			userid: "tanmayvij",
			name: "ABC XYZ",
			distance: 100,
			noOfChildren: 10,
			timings: "ABC",
			car: {
				make: "Hyundai",
				model: "i20",
				color: "Black",
				regno: "DL 1C 10 2626"
			},
			coordinates: {
				latitude: 28.540,
				longitude: 77.099
			},
			routeCoordinates: [
				{latitude: 28, longitude: 77},
				{latitude: 28.001, longitude: 77.005},
				{latitude: 28.006, longitude: 77.010}
			],
			driverImage: "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
		}
	]
	);
};

module.exports.saveRequest = function(req, res) {
	res.json({success: true})
}

module.exports.saveQuery = function(req, res) {
	res.json({success: true})
}