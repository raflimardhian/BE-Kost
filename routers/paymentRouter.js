const express = require("express");
const router = express.Router();
const controller = require('../controllers/paymentController')
const checkToken = require('../middleware/checkToken')

router.post('/:id', checkToken, controller.createPayment)
router.post('/notif', controller.handlePaymentNotification)
router.delete('/:id',  checkToken, controller.deletePayment)
router.get('/', controller.getPayment)

module.exports = router;