const express = require('express');
const { forgotPassword, verifyToken, resetPassword } = require('../Controller/passwordController');
const validateRequest = require('../middlewares/validateRequest');
const passwordLimiter = require('../middlewares/rateLimiter.js');

const router = express.Router();

router.post('/forgot-password', passwordLimiter, validateRequest, forgotPassword);
router.post('/verify-token', validateRequest, verifyToken);
router.post('/reset-password', validateRequest, resetPassword);

module.exports = router;
