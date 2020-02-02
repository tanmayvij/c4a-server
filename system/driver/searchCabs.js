var mongoose = require('mongoose');
var Driver = mongoose.model("Driver");

module.exports = function(req, res) {


	var pickupPoint = {
		type: "Point",
		coordinates: [
			req.query.pickupLng,
			req.query.pickupLat
		]
	};

	var dropPoint = {
		type: "Point",
		coordinates: [
			req.query.dropLng,
			req.query.dropLat
		]
	};

	Driver
	/*.aggregate([
		{
			$geoNear: {
				maxDistance: 500,
				spherical: true,
				distanceField: "distance",
				near: dropPoint
			}
		}
	])*/
	.find({})
	.exec(function(err, response) {
		if(err) {
			res.status(500).json({"error": "Something went wrong. Please try again later."});
		}
		else {
/*
			var temp = response;
			temp.noOfChildren = temp.car.route.length - 2;
			temp.startTime = temp.car.startTime;
			temp.coordinates = {};
			temp.routeCoordinates = [];

			temp.car.route.forEach(element => {
				temp.routeCoordinates.push({
					latitude: element.coordinates[1],
					longitude: element.coordinates[0]
				})
			});
*/
			res.status(200).json( /* temp */
			[
				{
					userid: "tanmayvij",
					name: "ABC XYZ",
					phone: "+911234567890",
					distance: 100,
					noOfChildren: 10,
					startTime: "ABC",
					car: {
						_id: "axvcb",
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
			)
		}
	});

};