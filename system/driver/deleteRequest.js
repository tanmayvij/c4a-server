var mongoose = require('mongoose');
var Request = mongoose.model("Request");

module.exports = function(req,res) {

	var id = req.id || req.params.id;
	if(!id)
	{
		res.status(400).json({"error": "Params missing"});
		return;
	}
	Request
	.deleteOne({_id: id})
	.exec(function(err) {
		if(err) {
			res.status(500).json({"error": "Something went wrong."});
		}
		else {
			res.status(200).json({"success" :true})
		}
	})
};