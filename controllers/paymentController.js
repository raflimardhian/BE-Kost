require('dotenv').config();
const midtransClient = require("midtrans-client");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const { payment, user, room } = require('../models/index')



module.exports = {
    createPayment: async (req, res, next) => {
        try {
            const roomId = req.params.id;
            const {payment_method} =  req.body
        
            let snap = new midtransClient.Snap({
                // Set to true if you want Production Environment (accept real transaction).
                isProduction: false,
                serverKey: process.env.PAYMENT_SERVER_KEY,
            });
        
            const user = await prisma.user.findUnique({
                where: { id: Number(req.user.id) },
                include: {
                profile: true,
                },
            });
        
            const room = await prisma.room.findUnique({
                where: { id: Number(roomId) },
            });
            
            if (room.userId != null){
                return res.status(500).json({
                    status: "failed",
                    message: `Kamar sudah terisi`,
                });
            }
            const originalPrice = Number(room.price);
            const ppnRate = 0.11;
            const ppnAmount = originalPrice * ppnRate;
            const totalPrice = originalPrice + ppnAmount;
        
            let newPayment = await prisma.payment.create({
                data: {
                total_price:totalPrice,
                roomId: room.id,
                userId: Number(req.user.id),
                payment_method,
                status: "UNPAID",
                createdAt: new Date(),
                updatedAt: new Date() 
                },
            });
        
            let parameter = {
                transaction_details: {
                order_id: newPayment.id + 100,
                gross_amount: room.price,
                },
                credit_card: {
                secure: true,
                },
                customer_details: {
                first_name: user.profile.name,
                email: user.email,
                phone: user.profile.phone,
                },
            };
        
            let transaction = await snap.createTransaction(parameter);

            await prisma.room.update({
                where: { id: Number(roomId) },
                data: {
                    userId: Number(req.user.id),
                },
            });
        
            res.status(201).json({
                status: true,
                message: "",
                data: {
                room,
                newPayment,
                token: transaction,
                },
            });
            } catch (err) {
            next(err);
        }
    },
}