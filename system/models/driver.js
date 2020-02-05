var mongoose = require('mongoose');

var waypointSchema = new mongoose.Schema({
	child: String,
	coordinates: {
		  type : [Number],
		  index : '2dsphere'
		}
});

var carSchema = new mongoose.Schema({
	id : {
		type : String
	},
    regno : {
        type : String,
		default: null
    },
    make : {
        type : String
    },
    model : {
        type : String
    },
	color : {
		type : String
	},
    rcUri : {
        type : String
	},
	route: {
		type: [waypointSchema]
	},
	startTime: {
		type: String
	},
	status: {
		type: Number
	}
});

var aadharSchema = new mongoose.Schema({
	number : {
		required : true,
        type : String,
        unique : true
	},
	imageUri : {
		required : true,
        type : String,
        unique : true
	}
});

var licenseSchema = new mongoose.Schema({
	number : {
		required : true,
        type : String,
        unique : true
	},
	expiry : {
		required : true,
        type : Date
	},
	imageUri : {
		required : true,
        type : String,
        unique : true
	}
});

var driverSchema = new mongoose.Schema({
    userid : {
    	type : String,
    	required : true,
    	unique: true
    },
	imageUri : {
		type : String,
		required : true,
		unique : true
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
    aadhar : {
        type : aadharSchema,
        required : true
    },
    license : {
        type : licenseSchema,
        required : true
    },
	token : {
    	type : String
  	}
});

mongoose.model("Driver", driverSchema, "drivers");