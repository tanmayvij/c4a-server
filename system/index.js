const express = require('express');
const router = express.Router();

router.route('/driver')
.get(require('./driver.controller').showAll);

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