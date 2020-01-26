var mongoose = require('mongoose');
var Query = mongoose.model("Query");
const fetch = require('node-fetch');

module.exports = function(req,res) {

	
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
							console.log(response);   
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