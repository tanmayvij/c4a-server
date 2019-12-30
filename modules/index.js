const express = require('express');
const router = express.Router();
const driver = require('./driver.controller');
const parent = require('./parent.controller');
const auth = require('./auth.controller')

router.route('/driver')
.get(auth.checkAdmin, driver.showAll)
.post(auth.checkAdmin, driver.register);

router.route('/parent')
.get(auth.checkAdmin, parent.showAll)
.post(auth.checkAdmin, parent.register);

module.exports = router;