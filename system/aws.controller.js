const AWS = require('aws-sdk');
const multer = require('multer');
const config = require('../config.json').S3;

const endpoint = new AWS.Endpoint(config.endpoint);

const s3Client = new AWS.S3({
    accessKeyId: config.keyid,
    secretAccessKey: config.secret,
	endpoint: endpoint
});

 
module.exports.doUpload = (req, res) => {	
	var type = req.body.type;
	var id = req.body.id;
	var ext = req.file.originalname.split('.').pop();
	
	const params = {
         Bucket: config.bucket, 
         Key: `${type}/${id}.${ext}`,
         Body: req.file.buffer
	};
		
	s3Client.upload(params, (err, data) => {
		if (err) {
			res.status(500).json({error: err});
		}
		else {res.status(201).json({'success' : true, 'path': `${config.endpoint}/${config.bucket}/${params.Key}`})}
	});
};

module.exports.get = (req, res) => {
		const params = {
         Bucket: config.bucket, 
         Key: req.filepath
		};
		
	s3Client.getObject(params, (err, data) => {
		if (err) {
			res.status(500).json({error: err});
		}
		else {
			var ext = req.filepath.split('.').pop();
			var base64 = new Buffer(data.Body, 'binary').toString('base64');
			var image = `data:image/${ext};base64,${base64}`;
			res.status(200)
			.json(
			{
				data: req.data,
				image: image
			}
			);
		}
	});
};


var storage = multer.memoryStorage()
 
module.exports.multer = multer({storage: storage});;