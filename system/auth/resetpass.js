const mongoose = require("mongoose");
const Parent = mongoose.model("Parent");
const Driver = mongoose.model("Driver");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const jwtkey = require("../../config.json").jwtkey;

module.exports = function(req, res) {
    var level = req.params.level;
    var userid = req.body.userid;
    var password = req.body.password;
    if(!level || (level !== 0 && level !== 1) || !userid || !password) {
        res.status(400).json({"error" : "bad request"});
    }
    else if(level == 0) {
        
    }
    else if(level == 1) {
        
    }
}