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
            
            function generateOrderId(paymentId) {
                const timestamp = new Date().getTime();
                return `ORDER-${paymentId}-${timestamp}`;
            }
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
                order_id: generateOrderId(newPayment.id),
                gross_amount: totalPrice,
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

    handlePaymentNotification: async (req, res) => {
        try {
            let notification = {
                currency: req.body.currency,
                fraud_status: req.body.fraud_status,
                gross_amount: req.body.gross_amount,
                order_id: req.body.order_id,
                payment_type: req.body.payment_type,
                status_code: req.body.status_code,
                status_message: req.body.status_message,
                transaction_id: req.body.transaction_id,
                transaction_status: req.body.transaction_status,
                transaction_time: req.body.transaction_time,
                merchant_id: req.body.merchant_id,
            };
        
            let data = await snap.transaction.notification(notification);
        
            const updatedPayment = await prisma.payment.update({
                where: { id: data.order_id },
                data: {
                status: "PAID",
                payment_method: data.payment_type,
                updatedAt: new Date()
                },
            });
        
            res.status(200).json({
                status: true,
                message: "",
                data: { updatedPayment },
            });
            } catch (err) {
                next(err);
            }
    },

    deletePayment: async (req, res, next) => {
        try {
            const roomId = req.params.id;
    
            const existingPayment = await prisma.payment.findFirst({
                where: {
                    roomId: Number(roomId),
                },
            });
    
            if (!existingPayment) {
                return res.status(404).json({
                    status: "failed",
                    message: `Pembayaran dengan id room ${roomId} tidak ditemukan.`,
                });
            }
    
            await prisma.payment.delete({
                where: {
                    id: existingPayment.id,
                },
            });
    
            await prisma.room.update({
                where: {
                    id: Number(roomId),
                },
                data: {
                    userId: null, 
                },
            });
    
            res.status(200).json({
                status: "success",
                message: "Pembayaran berhasil dihapus dan status kamar dikembalikan.",
            });
        } catch (err) {
            console.log(error)
            next(err);
        }
    },
    deleteManyPayments: async (req, res, next) => {
        try {
            const deletedPayments = await prisma.payment.deleteMany();
    
            res.status(200).json({
                status: "success",
                message: "Semua payment berhasil dihapus.",
                data: deletedPayments,
            });
        } catch (err) {
            console.error(err);
            next(err);
        }
    },

    getPayment: async (req, res, next) => {
        try{
            const payments = await prisma.payment.findMany()

            res.status(200).json({
                status: "success",
                message: "Berhasil menampilkan data payment.",
                payments
            });
        } catch (err){
            next(err)
        }
    }
}