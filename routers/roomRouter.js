const express = require("express");
const router = express.Router();
const controller = require('../controllers/roomController')
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post('/', upload.single("imageUrl"),controller.createRoom)
router.get('/', controller.getRooms)
router.get('/:id', controller.getByid)
router.delete('/:id', controller.delete)
router.put('/:id', controller.updateRoom)

module.exports = router;