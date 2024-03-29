const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const { user, profile } = require("../models");
const utils = require("../utils/index.js");
const imageKit = require("../utils/index.js");

module.exports = {
  create: async (req, res, next) => {
    try {
      const {
        name, phone, city, address, profile_picture, job
      } = req.body;
      const fileTostring = req.file.buffer.toString("base64");

      const uploadFile = await utils.imageKit.upload({
        fileName: req.file.originalname,
        file: fileTostring,
      });

      const profiles = await profile.create({
        data: {
          name,
          phone,
          city,
          address,
          job,
          profile_picture: uploadFile.url,
        },
      });

      return res.status(201).json({
        profiles,
      });
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const {
        name, phone, city, address, profile_picture, job
      } = req.body;
      const fileTostring = req.file.buffer.toString("base64");

      const userId = req.user.id;
      const uploadFile = await utils.imageKit.upload({
        fileName: req.file.originalname,
        file: fileTostring,
      });

      const profiles = await prisma.profile.update({
        where: {
          id: Number(userId),
        },
        data: {
          name,
          phone,
          city,
          job,
          address,
          profile_picture: uploadFile.url,
        },
      });

      return res.status(200).json({
        status: "success",
        profiles,
      });
    } catch (error) {
      next(error);
    }
  },
  updateByParams: async (req, res, next) => {
    try {
      const {
        name, phone, city, address, profile_picture, job
      } = req.body;
      const fileTostring = req.file.buffer.toString("base64");

      const userId = req.params.id;
      const uploadFile = await utils.imageKit.upload({
        fileName: req.file.originalname,
        file: fileTostring,
      });

      const profiles = await prisma.profile.update({
        where: {
          id: Number(userId),
        },
        data: {
          name,
          phone,
          city,
          job,
          address,
          profile_picture: uploadFile.url,
        },
      });

      return res.status(200).json({
        status: "success",
        profiles,
      });
    } catch (error) {
      next(error);
    }
  },
  getId: async (req, res) => {
    try {
      const getProfile = await profile.findUnique({
        where: {
          id: req.user.id,
        },
        include: {
          user: true,
        },
      });
      if (!getProfile) {
        return res.status(404).json({
          status: "failed",
          message: `Pengguna dengan ID ${id} tidak ditemukan`,
        });
      }

      return res.status(200).json({
        status: "succes",
        getProfile,
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  },
  getParamsId: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const getProfile = await profile.findUnique({
        where: {
          id:id,
        },
        include: {
          user: true,
        },
      });
      if (!getProfile) {
        return res.status(404).json({
          status: "failed",
          message: `Pengguna dengan ID ${id} tidak ditemukan`,
        });
      }

      return res.status(200).json({
        status: "succes",
        getProfile,
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const allProfiles = await profile.findMany({
        include: {
          user: true,
        },
      });
      
      res.json(allProfiles);
      // return res.status(200).json({
      //   status: "success",
      //   allProfiles
      // });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  },
  delete: async (req, res, next) => {
    try {
      const existingUser = await prisma.profile.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      if (!existingUser) {
        return res.status(404).json({
          status: "failed",
          message: `Pengguna dengan ID ${id} tidak ditemukan`,
        });
      }

      const profiles = await profile.delete({
        where: {
          id: parseInt(req.user.id),
        },
      });
      await user.delete({
        where: {
          id: parseInt(id),
        },
      });

      res.status(200).json({
        status: "success",
        message: `Pengguna dengan ID ${id} berhasil dihapus`,
      });
    } catch (error) {
      next(error);
    }
  },
};
