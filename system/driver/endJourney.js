const mongoose = require('mongoose');
var Driver = mongoose.model('Driver');

module.exports = function(req, res) {
    
    Driver.findOne({
        userid: req.userid
    })
    .exec(function(err, response) {
        if(err) {
            res.status(500).json({"error": "Something went wrong. Please try again later."});
        }
        else {
            response.car.forEach(element => {
                if(element.id == req.query.car) {
                    element.status = undefined;
                }
            });
            response.save();
            res.status(200).json({success: true})
        }
    })

}