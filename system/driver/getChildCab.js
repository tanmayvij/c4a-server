const mongoose = require('mongoose');
var Driver = mongoose.model('Driver');
const AWS = require('aws-sdk');
const config = require('../../config.json').S3;

const endpoint = new AWS.Endpoint(config.endpoint);

const s3Client = new AWS.S3({
    accessKeyId: config.keyid,
    secretAccessKey: config.secret,
	endpoint: endpoint
});

module.exports = function(req, res) {
    if(req.query.cab) {
        Driver.findOne({"car.id": req.query.cab})
        .exec(function(err, data) {
            if(err) {
                res.status(500).json({"error": "Something went wrong. Please try again later.", "status": false})
            }
            else if(!data) {
                res.status(404).json({status: false});
            }
            else {

                data.car.forEach(element => {
                    if(element.id == req.query.cab) {
                        data.car_selected = element;
                    }
                });

                const params = {
                    Bucket: config.bucket, 
                    Key: `driver/${data.imageUri.split('/').pop()}`
                };
                
                s3Client.getObject(params, (err, img) => {
                    var base64 = new Buffer(img.Body, 'binary').toString('base64');
                    var image = `data:${img.ContentType};base64,${base64}`;
                    
                    res.json({
                        regno: data.car_selected.regno,
                        color: data.car_selected.color,
                        make: data.car_selected.make,
                        model: data.car_selected.model,
                        name: data.name,
                        phone: data.phone,
                        image: image,
                        status: true
                    })
                });
            }
        });
    }
}