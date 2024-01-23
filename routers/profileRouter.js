const express = require("express");
const router = express.Router();
const controller = require('../controllers/profileController')
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post('/', controller.create)
router.get('/', controller.getAll)
router.put('/:id',upload.single("profile_picture"), controller.update)

module.exports = router;