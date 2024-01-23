const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
    user: prisma.user,
    room: prisma.room,
    profile: prisma.profile,
    payment: prisma.payment 
};