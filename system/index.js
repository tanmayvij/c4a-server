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

router.route('/getRequests/:carId')
.get(require('./auth/authenticate'), driver.getRequests);

router.route('/acceptRequest/:id')
.get(require('./auth/authenticate'), driver.acceptRequest, driver.updateRoute, driver.deleteRequest);

router.route('/deleteRequest/:id')
.delete(require('./auth/authenticate'), driver.deleteRequest);

router.route('/contactOnQuery/:id')
.get(require('./auth/authenticate'), driver.contactOnQuery);

router.route('/getQueries')
.get(driver.getQueries);

router.route('/addCar')
.post(require('./auth/authenticate'), driver.addCar);

router.route('/searchCabs')
.get(driver.searchCabs);

router.route('/saveRequest')
.post(driver.saveRequest);

router.route('/saveQuery')
.post(driver.saveQuery);

/*************************/

router.route('/getChild')
.get(require('./auth/authenticate'), parent.getChild);

router.route('/getParent')
.get(require('./auth/authenticate'), parent.getOne, S3.get);

router.route('/addChild')
.post(require('./auth/authenticate'), parent.addChild);

/*************************/

router.route('/upload')
.post(S3.multer.single('file'), S3.doUpload);

/*************************/

router.route('/login/:level')
.post(require('./auth/login'));

router.route('/register/:level')
.post(require('./auth/register'));

router.route('/forgot/:level')
.post(require('./auth/forgot'));

router.route('/resetpass/:level')
.post(require('./auth/resetpass'));

router.route('/update/:level/:userId')
.put(require('./auth/update'));

router.route('/checkDuplicate')
.post(require('./auth/checkDuplicate'))


module.exports = router;