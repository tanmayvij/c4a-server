const express = require('express');
const router = express.Router();
const S3 = require('./aws.controller');

router.route('/driver')
.get(require('./driver.controller').showAll);

router.route('/upload')
.post(S3.multer.single('file'), S3.doUpload)

router.route('/login/:level')
.post(require('./auth/login'));

router.route('/register/:level')
.post(require('./auth/register'));

router.route('/forgot/:level')
.post(require('./auth/forgot'));

router.route('/resetpass/:level')
.get(require('./auth/resetpass'));

router.route('/update/:level/:userId')
.put(require('./auth/update'));


module.exports = router;