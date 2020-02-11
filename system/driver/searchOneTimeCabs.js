var mongoose = require('mongoose');
var Driver = mongoose.model("Driver");
var geolib = require('geolib');
const AWS = require('aws-sdk');
const config = require('../../config.json').S3;

const endpoint = new AWS.Endpoint(config.endpoint);

const s3Client = new AWS.S3({
    accessKeyId: config.keyid,
    secretAccessKey: config.secret,
	endpoint: endpoint
});

module.exports = function(req, res) {


	var pickupPoint = {
		latitude: parseFloat(req.query.pickupLat),
		longitude: parseFloat(req.query.pickupLng)
	};

	var dropPoint = {
		latitude: parseFloat(req.query.dropLat),
		longitude: parseFloat(req.query.dropLng)
	};

	Driver
	.find({})
	.exec(function(err, response) {
		if(err) {
			res.status(500).json({"error": "Something went wrong. Please try again later."});
		}
		else {
			var finalData = [], nearest = {}, route = [], newDriver = {};
			response.forEach(driver => {
				driver.car.forEach(car => {
					if(car.route.length > 0 && car.status)
					{
						route = [];
						car.route.forEach(waypoint => {
							route.push({
								latitude: waypoint.coordinates[1],
								longitude: waypoint.coordinates[0]
							})
						});
						nearest = geolib.findNearest(pickupPoint, route);
						car.distanceFromPickup = geolib.getDistance(pickupPoint, nearest);
						car.distanceFromDrop = geolib.getDistance(dropPoint, route[route.length - 1]);

						if(car.distanceFromPickup <= 50000 && car.distanceFromDrop <= 20000) {
							newDriver = {
								userid: driver.userid,
								name: driver.name,
								phone: driver.phone,
								distance: car.distanceFromPickup,
								noOfChildren: car.route.length - 2,
								startTime: car.startTime,
								car: car,
								coordinates: nearest,
								routeCoordinates: route,
								imageKey: driver.imageUri.split('/').pop(),
								driverImage: ''
							};
							finalData.push(newDriver);
						}
					}
				});
			});
			res.status(200).json(finalData);
		}
	});

};
