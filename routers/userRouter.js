const express = require("express");
const router = express.Router();
const checkRole = require("../middleware/checkRole");
const checkToken = require("../middleware/checkToken");
const controller = require('../controllers/user_controller')

router.post('/', controller.register)
router.post('/login', controller.login)
router.get('/', controller.getAllUsers)
router.get('/:id', controller.getById)
router.delete('/:id', controller.deleteUser)
router.post('/otp', controller.otp)
router.post('/verify', controller.verify)
router.post('/forget-password', controller.forgetPassword)
router.post('/insert-password', controller.insertPassword)
router.post('/admin', controller.loginAdmin)

module.exports = router;