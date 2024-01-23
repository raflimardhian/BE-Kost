const express = require("express");
const router = express.Router();
const controller = require('../controllers/paymentController')
const checkToken = require('../middleware/checkToken')

router.post('/:id', checkToken, controller.createPayment)


module.exports = router;