const express = require("express");
const router = express.Router();
const controller = require('../controllers/roomController')

router.post('/',controller.createRoom)
router.get('/', controller.getRooms)
router.get('/:id', controller.getByid)
router.delete('/:id', controller.delete)
router.put('/:id', controller.updateRoom)

module.exports = router;