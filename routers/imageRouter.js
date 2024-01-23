const express = require("express");
const router = express.Router();
const controller = require('../controllers/imageController')
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/',  upload.single("imageUrl"),controller.create)
router.get('/', controller.getAll)
router.get('/:id', controller.getById)
router.delete('/:Id', controller.delete)
router.put('/:id', controller.update)

module.exports = router