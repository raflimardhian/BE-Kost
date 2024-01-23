const express = require("express");
const router = express.Router();

const auth = require('./userRouter');
const room = require('./roomRouter');
const image = require('./imageRouter');
const payment = require('./paymentRouter')
const profile = require('./profileRouter')

router.use('/auth', auth)
router.use('/room', room)
router.use('/image', image)
router.use('/payment', payment)
router.use('/profile', profile)

module.exports = router;
