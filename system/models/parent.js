var mongoose = require('mongoose');

var childSchema = new mongoose.Schema({
	id : {
		type : String,
        required : true,
		unique: true
	},
    name : {
        type : String,
        required : true
    },
    institution : {
		name : String,
		// longitude (E/W), latitude (N/S) order.
		coordinates : {
		  type : [Number],
		  index : '2dsphere'
		}
    }
});

var parentSchema = new mongoose.Schema({
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
        default : 1
    },  
	name : {
    	type : String,
    	required : true
  	},
  	email : {
    	type : String,
    	required : true,
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
    child : {
        type : [childSchema]
    }  
});

mongoose.model("Parent", parentSchema, "parents");