const express = require("express");
const router = express.Router();
const controller = require('../controllers/profileController')
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const checkToken = require("../middleware/checkToken")
const checkRole = require("../middleware/checkRole")


router.post('/', controller.create)
router.get('/', checkToken,controller.getAll)
router.put('/', checkToken,upload.single("profile_picture"), controller.update)
router.get('/:id',checkToken, controller.getId)
router.put('/:id', checkToken,upload.single("profile_picture"), controller.updateByParams)


module.exports = router;