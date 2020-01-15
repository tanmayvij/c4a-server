var mongoose = require('mongoose');

var carSchema = new mongoose.Schema({
	id : {
		type : String,
        required : true,
		unique: true
	},
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
		type : String,
		required : true
	},
    rcUri : {
		required : true,
        type : String,
        unique : true
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