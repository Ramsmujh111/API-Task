const express = require('express');
const router = express.Router();
const error_404Router = require('../controller/error-404');

router.use(error_404Router.error_404);

module.exports = router;