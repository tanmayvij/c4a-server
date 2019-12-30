var mongoose = require('mongoose');

var childSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    grade : {
        type : String
    },
    school : {
        type : String,
        required : true
    }
});

var parentSchema = new mongoose.Schema({
    userid : {
    	type : String,
    	required : true,
    	unique: true
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