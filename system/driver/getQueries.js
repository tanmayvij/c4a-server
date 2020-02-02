var mongoose = require('mongoose');
var Query = mongoose.model("Query");

module.exports = function(req,res) {

	var routeStrings = req.query.route.split('|');

	var geoQueries = [];

	routeStrings.forEach(element => {
		let arr = element.split(',');
		geoQueries.push([parseFloat(arr[1]), parseFloat(arr[0])]);
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
		.find({
			$and: [
				{
					"institution.coordinates": {
						$near: {
							$maxDistance: 20000,
							$geometry: destinationPoint
						}
					}
				}/*,
				{
					"pickup.coordinates": {
						$geoIntersects: {
							$geometry: {
								type: "MultiPoint",
								coordinates: geoQueries
							}
						}
					}
				}*/
			]
		})
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