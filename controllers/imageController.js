const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const utils = require('../utils/index')


module.exports = {
    create: async (req, res, next) => {
        try {
          const {
            roomId, imageUrl
          } = req.body;
          const fileTostring = req.file.buffer.toString("base64");
    
          const uploadFile = await utils.imageKit.upload({
            fileName: req.file.originalname,
            file: fileTostring,
          });

          let parseRoom = parseInt(roomId);
    
          const image = await prisma.image.create({
            data: {
              roomId:parseRoom,
              imageUrl: uploadFile.url,
            },
          });
    
          return res.status(201).json({
            image,
          });
        } catch (error) {
          next(error);
        }
    },
    getAll : async (req, res, next) => {
        try {
          const images = await prisma.image.findMany();
          res.status(200).json(images);
        } catch (error) {
          next(error);
        }
    },
    getById : async (req, res, next) => {
        try {
          const imageId = parseInt(req.params.id);
          
          if (isNaN(imageId)) {
            return res.status(400).json({ error: 'ID tidak valid' });
          }
      
          const image = await prisma.image.findUnique({
            where: {
              id: imageId,
            },
          });
      
          if (!image) {
            return res.status(404).json({ error: 'Image tidak ditemukan' });
          }
      
          res.status(200).json(image);
        } catch (error) {
          next(error);
        }
    },
    delete: async (req, res, next) => {
        try {
          const imageId = parseInt(req.params.id);
      
          if (isNaN(imageId)) {
            return res.status(400).json({ error: 'ID tidak valid' });
          }
      
          const deletedImage = await prisma.image.delete({
            where: {
              id: imageId,
            },
          });
      
          res.status(200).json(deletedImage);
        } catch (error) {
          next(error);
        }
    },
    update:async (req, res, next) => {
        try {
          const imageId = parseInt(req.params.id);
          const { roomId, imageUrl } = req.body;
      
          if (isNaN(imageId) || !roomId || !imageUrl) {
            return res.status(400).json({ error: 'ID, roomId, dan imageUrl harus diisi' });
          }
      
          const updatedImage = await prisma.image.update({
            where: {
              id: imageId,
            },
            data: {
              roomId,
              imageUrl,
            },
          });
      
          res.status(200).json(updatedImage);
        } catch (error) {
          next(error);
        }
    }
}