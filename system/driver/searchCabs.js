var mongoose = require('mongoose');
var Driver = mongoose.model("Driver");

module.exports = function(req, res) {




	Driver
	.aggregate([])

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