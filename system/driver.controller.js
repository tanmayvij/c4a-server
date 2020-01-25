var mongoose = require('mongoose');
var Driver = mongoose.model("Driver");
var Request = mongoose.model("Request");
var Query = mongoose.model("Query");
const fetch = require('node-fetch');

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
/*
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
		});*/
	
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
					apikey: require('../config.json').msgApiKey,
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
					var endpoint = element.route.pop();
					element.route.push(req.route);
					element.route.push(endpoint);
					element.route = optimizeRoute(element.route);
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

	
	if(!req.params.id)
	{
		res.status(400).json({"error": "Params missing"});
		return;
	}
	Query
	.aggregate([
		{
			$match: {
				_id: mongoose.Types.ObjectId( req.params.id)
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
				
				pipeline: [
					{
						$match: {
							userid: req.userid
						}
					}
				],
				
				as: "driver"
			}
		}
	])
	.exec(function(err, response) {
		if(err) {
			res.status(500).json({"error": "Something went wrong."});
		}
		else if(response.length == 0) {
			res.status(404).json({"error": "Query not found."});
		}
		else {
			var data = response[0];
			data.parent = response[0].parent[0];
			data.driver = response[0].driver[0];
			
			var message = `Dear ${data.parent.name}, ${data.driver.name} has expressed interest for your Cab4All query for ${data.childName}. You can now contact the driver on ${data.driver.phone}. Thank you for using Cab4All.`;
			var params = {
					apikey: require('../config.json').msgApiKey,
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
                            statusCode = 200;
							returnData = {"success": true};
							res.status(statusCode).json(returnData);
                        }
                        else
                        {
                            console.log({"error": JSON.stringify(response)});
							statusCode = 500;
							returnData = { "error" : response };
							res.status(statusCode).json(returnData);
                        } 
                    }
                );
		}
	})
	
};

module.exports.searchCabs = function(req, res) {
	res.json(
	[
		{
			userid: "tanmayvij",
			name: "ABC XYZ",
			distance: 100,
			noOfChildren: 10,
			startTime: "ABC",
			car: {
				_id: "meowmeowww",
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


module.exports.configureRoute = function(req, res) {
	
	Driver
	.findOne({userid: req.userid})
	.exec(function(err, driver) {
		if(err) {
			res.status(500).json({"error": JSON.stringify(err)});
		}
		else {
			driver.car.forEach(element => {
				if(element._id == req.body.carId) {
					optimizeRoute(req.body.route, function(newRoute) {
						element.route = newRoute;
						element.startTime = req.body.startTime;
						driver.save(function(err, result) {
							if(err) {
								res.status(500).json({"error": JSON.stringify(err)});
							}
							else {
								res.status(201).json({"success": true});
							}
						});
					});
					
				}
			});
		}
	});
	
};

function optimizeRoute(route, callback) {
	
	var waypoints = 'optimize:true|';
	
	var temp = route;
	var start = temp.shift();
	var end = temp.pop();
	
	temp.forEach(element => {
		waypoints += `${element.coordinates[1]},${element.coordinates[0]}|`
	});
	
	var params = {
				waypoints: waypoints,
				origin: start.coordinates[1] + ',' + start.coordinates[0],
				destination: end.coordinates[1] + ',' + end.coordinates[0],
				key: require('../config.json').mapsApiKey
			}
			var esc = encodeURIComponent;
			var query = Object.keys(params)
				.map(k => esc(k) + '=' + esc(params[k]))
				.join('&');

	fetch(`https://maps.googleapis.com/maps/api/directions/json?${query}`)
	.then((response) => response.json())
	.then((response) => {
		
		var newRoute = [];
		
		newRoute.push(start);
		
		if(response.routes.length !== 0) {
			response.routes[0].waypoint_order.forEach(i => {
				newRoute.push(temp[i]);
			});
		}
		else {
			temp.forEach(element => {
				newRoute.push(element);
			})
		}
		
		newRoute.push(end);
		callback(newRoute);
	});
}