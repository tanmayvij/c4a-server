const express = require('express');
const router = express.Router();
const S3 = require('./aws.controller');
const parent = require('./parent');
const driver = require('./driver');

router.route('/getCar')
.get(require('./auth/authenticate'), driver.getCar);

router.route('/getDriver')
.get(require('./auth/authenticate'), driver.getOne, S3.get);

router.route('/getRequests/:carId')
.get(require('./auth/authenticate'), driver.getRequests);

router.route('/acceptRequest/:id')
.get(require('./auth/authenticate'), driver.acceptRequest, driver.updateRoute, parent.updateChildCab, driver.deleteRequest);

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

router.route('/searchOneTimeCabs')
.get(driver.searchOneTimeCabs);

router.route('/getChildCab')
.get(driver.getChildCab);

router.route('/startJourney')
.get(require('./auth/authenticate'), driver.startJourney);

router.route('/endJourney')
.get(require('./auth/authenticate'), driver.endJourney);

router.route('/configureRoute')
.put(require('./auth/authenticate'), driver.configureRoute);


/*************************/

router.route('/getChild')
.get(require('./auth/authenticate'), parent.getChild);

router.route('/getParent')
.get(require('./auth/authenticate'), parent.getOne, S3.get);

router.route('/addChild')
.post(require('./auth/authenticate'), parent.addChild);


router.route('/saveRequest')
.post(require('./auth/authenticate'), parent.saveRequest);

router.route('/saveQuery')
.post(require('./auth/authenticate'), parent.saveQuery);

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