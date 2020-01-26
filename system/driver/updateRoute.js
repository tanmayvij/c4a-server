var mongoose = require('mongoose');
var Driver = mongoose.model("Driver");
const fetch = require('node-fetch');

module.exports = function(req, res, next) {
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
					optimizeRoute(element.route, function(newRoute) {
						element.route = newRoute;
						result.save();
						req.id = req.RequestId;
						next();
					});
				}
			});
		}
	})
}

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
				key: require('../../config.json').mapsApiKey
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