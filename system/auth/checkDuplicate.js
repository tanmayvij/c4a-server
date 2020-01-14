const mongoose = require("mongoose");
const Parent = mongoose.model("Parent");
const Driver = mongoose.model("Driver");

module.exports = function(req, res) {
    var level = req.body.level;
    var type = req.body.type;
    var value = req.body.value;

    if(level == 0)
    {
        Driver.findOne(JSON.parse(`{${type}: ${value}}`))
        .exec(function(err, result) {
            if(err) res.status(500).json({"error": "Server Error"});
            else if(!result) res.status(200).json({"status": true});
            else res.status(200).json({"status": false});
        })
    }
    else if(level == 1)
    {
        Parent.findOne(JSON.parse(`{"${type}": "${value}"}`))
        .exec(function(err, result) {
            if(err) res.status(500).json({"error": "Server Error"});
            else if(!result) res.status(200).json({"status": true});
            else res.status(200).json({"status": false});
        })
    }
    else
    {
        res.status(400).json({"error": "Bad Request"});
    }
}