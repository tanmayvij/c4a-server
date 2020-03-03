var mongoose = require('mongoose');
var Parent = mongoose.model("Parent");

module.exports = function(req, res, next) {
    Parent
    .findOne({userid: req.parentId})
    .exec(function(err, data) {
        if(err || !data) {
            res.status(500).json({"error": "Something went wrong. Please try again later."});
        }
        else {
            var child = req.child;
            data.child.forEach(element => {
                if(element.name == child) {
                    element.cabId = req.carId;
                }
            });
            data.save();
            next();
        }
    })
}