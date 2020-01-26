var mongoose = require('mongoose');
var Query = mongoose.model("Query");

module.exports = function(req,res) {

	var routeStrings = req.query.route.split('|');

	var geoQueries = [];

	routeStrings.forEach(element => {
		let arr = element.split(',');
		geoQueries.push({
			$geoNear: {
				spherical: true,
				maxDistance: 400,
				key: "pickup.coordinates",
				near: {
					type: "Point",
					coordinates: [
						parseFloat(arr[1]), parseFloat(arr[0])
					]
				},
				distanceField: "pickupDistance"
			}
		})
	})
	geoQueries.pop(); // Remove last null element caused by extra '|'

	var destinationPoint = {
		type: "Point",
		coordinates: [
			parseFloat(req.query.lng),
			parseFloat(req.query.lat)
		]
	}

		Query
		.aggregate([
			{
				$geoNear: {
					distanceField: "instDistance",
					spherical: true,
					maxDistance: 20000000,
					near: destinationPoint,
					key: "institution.coordinates"
				}
			}/*,
			{
				$or: geoQueries
			}*/
		])
		.exec(function(err, data) {
			if(err)	{
				console.log(err);
				res.status(500).json({"error": "Internal Server Error. Please try again later"});
			}
			else {
				console.log("GET Parent Queries data");
				res.status(200).json(data);
			}
		});
	
};