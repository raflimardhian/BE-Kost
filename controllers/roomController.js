const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const { room, user, image } = require('../models/index')
const utils = require('../utils/index')

module.exports = {
    createRoom: async (req, res) => {
      try {
        const { number, time, price, description} = req.body;
    
        if (!number || !time || !price || !description) {
          return res.status(400).json({ error: 'Semua field harus diisi' });
        }
    
        const room = await prisma.room.create({
          data: {
            number,
            time:30,
            price,
            description,
          },
        });
    
        res.status(201).json(room);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "terjadi kesalahan server" });
      }
    },
    updateRoom : async (req, res) => {
      try {
        const { id } = req.params;
        const { number, time, price, description} = req.body;
    
        if (!number || !time || !price || !description) {
          return res.status(400).json({ error: 'Semua field harus diisi' });
        }
        const existingRoom = await prisma.room.findUnique({
          where: {
            id: parseInt(id),
          },
        });
    
        if (!existingRoom) {
          return res.status(404).json({ error: 'Ruangan dengan ID yang diberikan tidak ditemukan' });
        }
        
        const updatedRoom = await prisma.room.update({
          where: {
            id: parseInt(id),
          },
          data: {
            number,
            time,
            price,
            description,
          },
        });
    
        res.status(200).json(updatedRoom);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
      }
    },
    getRooms: async (req, res) => {
      try {
        const rooms = await room.findMany({
          include: {
            image:true,
            user: {
              include: {
                profile: true
              }
            }
          }
        });
        res.json(rooms);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
      }
    },
    getByid: async (req, res) => {
      try {
        const roomId = parseInt(req.params.id);
    
        if (isNaN(roomId)) {
          return res.status(400).json({ error: 'ID tidak valid' });
        }
    
        const room = await prisma.room.findUnique({
          where: {
            id: roomId,
          },
          include:{
            image: true,
            user: true
          }
        });
    
        if (!room) {
          return res.status(404).json({ error: 'Ruangan tidak ditemukan' });
        }
    
        res.json(room);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
      }
    },
    delete: async (req, res) => {
      try {
        const roomId = parseInt(req.params.id);

        const existingRoom = await prisma.room.findUnique({
          where: {
            id: roomId,
          },
        });

        if (!existingRoom) {
          return res.status(404).json({ error: 'Room tidak ditemukan di database' });
        }
    
        if (!roomId) {
          return res.status(400).json({ error: 'ID tidak valid' });
        }
        const imageRoom = await prisma.image.findMany({
          where: {
            roomId: roomId,
          },
        });

        const existingPayment = await prisma.payment.findFirst({
          where:{
            roomId:roomId
          }
        })

        if(imageRoom.length > 0){
          await prisma.image.deleteMany({
            where: {
              roomId: roomId,
            },
          })
        }

        if (existingPayment) {
          await prisma.payment.deleteMany({
            where: {
              id: existingPayment.id,
            },
          });
        }
    
        await prisma.room.deleteMany({
          where: {
            id: roomId,
          },
        });
    
        res.status(200).json({
          status: "success",
          message: `Room dengan ID ${roomId} berhasil dihapus`,
        });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
      }
    },
    

};