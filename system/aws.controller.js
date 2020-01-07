var stream = require('stream');
const AWS = require('aws-sdk');
const multer = require('multer');
const config = require('../config.json').S3;

const endpoint = new AWS.Endpoint(config.endpoint);

const s3Client = new AWS.S3({
    accessKeyId: config.keyid,
    secretAccessKey: config.secret,
	endpoint: endpoint
});

const params = {
         Bucket: config.bucket, 
         Key: '', // pass key
         Body: null, // pass file body
};

 
module.exports.doUpload = (req, res) => {	
	var type = req.body.type;
	var userid = req.body.userid;
	var ext = req.file.originalname.split('.').pop();
	
	params.Key = `${type}/${userid}.${ext}`;
	params.Body = req.file.buffer;
		
	s3Client.upload(params, (err, data) => {
		if (err) {
			res.status(500).json({error: err});
		}
		else {res.status(201).json({'success' : true});}
	});
}


var storage = multer.memoryStorage()
 
module.exports.multer = multer({storage: storage});;