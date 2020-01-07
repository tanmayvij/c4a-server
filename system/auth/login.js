const mongoose = require("mongoose");
const Parent = mongoose.model("Parent");
const Driver = mongoose.model("Driver");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const jwtkey = require("../../config.json").jwtkey;

module.exports = function(req, res) {
    var level = parseInt(req.params.level);
    var userid = req.body.userid;
    var password = req.body.password;
    if((level !== 0 && level !== 1) || !userid || !password) {
        res.status(400).json({"error" : "Invalid request. Seems like some details are missing!"});
    }
    else if(level == 0) {
        // Driver login
        console.log("Driver login " + userid);
        Driver
        .findOne({
            $or: [
				{userid: userid},
				{email: userid}
			]
        })
        .exec(function(err, user){
            if(err) {
                console.log(err);
                res.status(500).json({"error": "Uh-oh! Something's wrong with our servers :( We'll be up and running soon!"});
            }
            else if(!user) {
                console.log("Login failed: User does not exist")
                res.status(404).json({"error" : "User does not exist"})
            }
            else {
                if(bcrypt.compareSync(password, user.password)) {
                    var payload = {
                        userid : userid,
                        username : user.name,
                        level: user.level
                    };
                    var token = jwt.sign(payload, jwtkey, { expiresIn : 3600*24 })
                    res.status(200).json({
                        'success' : true,
                        'token' : token
                    });
                }
                else
                {
                    console.log('Authentication failed');
                    res.status(401).json({'error' : 'Authentication failed: Invalid Password'});
                }
            }
        });
    }
    else if(level == 1) {
        // Parent login
        console.log("Parent login " + userid);
        Parent
        .findOne({
            $or: [
				{userid: userid},
				{email: userid}
			]
        })
        .exec(function(err, user){
            if(err) {
                console.log(err);
                res.status(500).json({"error": "Uh-oh! Something's wrong with our servers :( We'll be up and running soon!"});
            }
            else if(!user) {
                console.log("Login failed: User does not exist")
                res.status(404).json({"error" : "User does not exist"})
            }
            else {
                if(bcrypt.compareSync(password, user.password)) {
                    var payload = {
                        userid : userid,
                        username : user.name,
                        level: user.level
                    };
                    var token = jwt.sign(payload, jwtkey, { expiresIn : 3600*24 })
                    res.status(200).json({
                        'success' : true,
                        'token' : token
                    });
                }
                else
                {
                    console.log('Authentication failed');
                    res.status(401).json({'error' : 'Authentication failed'});
                }
            }
        });
    }
}