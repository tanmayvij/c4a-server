var mongoose = require('mongoose');
var Query = mongoose.model("Query");
var geolib = require("geolib")

module.exports = function(req,res) {

	var routeStrings = req.query.route.split('|');

	var waypointArr = [];

	routeStrings.forEach(element => {
		let arr = element.split(',');
		waypointArr.push({
			latitude: parseFloat(arr[0]),
			longitude: parseFloat(arr[1])
		});
	})
	waypointArr.pop(); // Remove last null element caused by extra '|'

	var destinationPoint = {
		type: "Point",
		coordinates: [
			parseFloat(req.query.lng),
			parseFloat(req.query.lat)
		]
	}
		Query
		.aggregate([{
			$geoNear:
				{
					maxDistance: 20000,
					near: destinationPoint,
					spherical: true,
					distanceField: 'instDistance',
					key: "institution.coordinates"
				}
		}])
		.exec(function(err, data) {
			if(err)	{
				console.log(err);
				res.status(500).json({"error": "Internal Server Error. Please try again later"});
			}
			else {
				console.log("GET Parent Queries data");
				var finalData = [];
				if(data)
				{
					data.forEach(element => {
						var pickupPoint = {
							latitude: element.pickup.coordinates[1],
							longitude: element.pickup.coordinates[0]
						};
						var nearest = geolib.findNearest(
							pickupPoint,
							waypointArr
						);
						element.pickupDist = geolib.getDistance(nearest, pickupPoint);
						if(element.pickupDist <= 5000) {
							finalData.push(element)
						}
					})
				}

				res.status(200).json(finalData);
			}
		});
	
};