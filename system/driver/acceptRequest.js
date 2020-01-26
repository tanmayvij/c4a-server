var mongoose = require('mongoose');
var Request = mongoose.model("Request");
const fetch = require('node-fetch');

module.exports = function(req,res,next) {

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
			fetch(require('../../config.json').msgApiUrl + '?' + query,
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