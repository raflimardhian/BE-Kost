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
            time,
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
    
        // Validasi input
        if (!number || !time || !price || !description) {
          return res.status(400).json({ error: 'Semua field harus diisi' });
        }
        // Cek apakah ruangan dengan ID yang diberikan sudah ada
        const existingRoom = await prisma.room.findUnique({
          where: {
            id: parseInt(id),
          },
        });
    
        if (!existingRoom) {
          return res.status(404).json({ error: 'Ruangan dengan ID yang diberikan tidak ditemukan' });
        }
        
        // Update data ruangan
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
        const rooms = await room.findMany();
        res.json(rooms);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
      }
    },
    getByid: async (req, res) => {
      try {
        const roomId = parseInt(req.params.id);
    
        // Validasi input
        if (isNaN(roomId)) {
          return res.status(400).json({ error: 'ID tidak valid' });
        }
    
        // Cari ruangan berdasarkan ID
        const room = await prisma.room.findUnique({
          where: {
            id: roomId,
          },
          include:{
            image: true,
            user: true
          }
        });
    
        // Jika ruangan tidak ditemukan
        if (!room) {
          return res.status(404).json({ error: 'Ruangan tidak ditemukan' });
        }
    
        // Kirim data ruangan sebagai respons
        res.json(room);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
      }
    },
    delete: async (req, res) => {
      try {
        const roomId = parseInt(req.params.id, 10);
    
        // Validasi input
        if (isNaN(roomId)) {
          return res.status(400).json({ error: 'ID tidak valid' });
        }
    
        // Hapus data berdasarkan ID
        const deletedRoom = await room.delete({
          where: {
            id: roomId,
          },
        });
    
        res.json(deletedRoom);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
      }
    },
    

};