var mongoose = require('mongoose');

var carSchema = new mongoose.Schema({
    regno : {
        required : true,
        type : String,
        unique : true
    },
    make : {
        required : true,
        type : String
    },
    model : {
        required : true,
        type : String
    },
    color : {
        type : String
    }
})

var driverSchema = new mongoose.Schema({
    userid : {
    	type : String,
    	required : true,
    	unique: true
    },
    level : {
        type : Number,
        default : 0
    },
	name : {
    	type : String,
    	required : true
  	},
  	email : {
    	type : String,
    	unique: true
  	},
  	phone : {
    	type : String,
    	required : true,
    	unique: true
  	},
  	date : {
   		 type : Date,
   		 "default" : Date.now
  	},
  	password : {
    	type : String,
    	required : true
    },
    car : 
    {
        type: [carSchema]
    },
    aadhar :
    {
        type : String,
        required : true
    },
    license : {
        type : String,
        required : true
    }
});

mongoose.model("Driver", driverSchema, "drivers");