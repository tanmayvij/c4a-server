const express = require('express');
const router = express.Router();
const S3 = require('./aws.controller');
const parent = require('./parent.controller');
const driver = require('./driver.controller');

router.route('/driver')
.get(driver.showAll);

router.route('/getCar')
.get(require('./auth/authenticate'), driver.getCar);

router.route('/getDriver')
.get(require('./auth/authenticate'), driver.getOne, S3.get);

router.route('/addCar')
.post(require('./auth/authenticate'), driver.addCar);

router.route('/getChild')
.get(require('./auth/authenticate'), parent.getChild);

router.route('/getParent')
.get(require('./auth/authenticate'), parent.getOne, S3.get);

router.route('/addChild')
.post(require('./auth/authenticate'), parent.addChild);


router.route('/upload')
.post(S3.multer.single('file'), S3.doUpload);


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

router.route('/checkDuplicate')
.post(require('./auth/checkDuplicate'))


module.exports = router;