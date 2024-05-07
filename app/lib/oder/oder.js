let models = require('../../models/oder');
let Product = require('../../models/products');
let cart = require('../../models/cart');
var nodemailer = require("nodemailer");
// const Joi = require('joi');
// const Promisebb = require('bluebird')
const _ = require('underscore');
// const bcrypt = require('bcryptjs')
// const jwtConf = require('../../../config/jwt');
// var jwt = require('jsonwebtoken');
// var moment = require('moment');
// var logger = require('../logger');
// // var common = require('../common');
// var ObjectID = require('mongodb').ObjectID;
// // var elastic = require('../../elastic');
// const { join } = require('path');
// const util = require('../utils');
exports.createOder = async (data) => {
    try {
        const { user_id, product_data, name, totalPrice, phone, email, content, address, ward, district, province, typePay, statusPay, note, statusOder } = data;
        const productIdsWithQuantity = product_data.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity
        }));
        for (const { product_id, quantity } of productIdsWithQuantity) {
            const product = await Product.findById(product_id);
            if (!product) {
                return Promise.reject({ show: true, message: `Sản phẩm với id ${product_id} không tồn tại` });
            }
            if (product.numberInStock < quantity) {
                return Promise.reject({ show: true, message: `Không đủ số lượng sản phẩm với tên ${product.name}` });
            }
            product.numberInStock -= quantity;
            await product.save();
        }
        let created = await models.create({ user_id, product: productIdsWithQuantity, name, totalPrice, phone, note, email, content, address, ward, district, province, typePay, statusPay, statusOder });
        if (created) {
            console.log("created", created);
            await cart.deleteOne({ user_id });
            this.sendMail(data)
        }
        return Promise.resolve(created);
    } catch (error) {
        console.error("Error creating Oder:", error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}



exports.allOderByUser = async (user_id) => {
    try {
        let data = await models.find({ user_id })
            .populate('user_id')
            .populate({
                path: 'product.product_id'
            })
            .sort({ createdAt: -1 }); // Sắp xếp tăng dần, nếu muốn giảm dần sử dụng -1    
        return Promise.resolve(data);
    } catch (error) {
        console.log(error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}

exports.allOder = async (data) => {
    try {
        let statusOder
        if (data) {
            statusOder = data
            console.log(statusOder);
            data = await models.find({ statusOder: statusOder })
                .populate('user_id') // Lấy thông tin của người dùng nếu cần
                .populate({
                    path: 'product.product_id', // Đường dẫn đến trường mảng product và trường product_id bên trong mảng đó
                }).sort({ createdAt: -1 }); // Sắp xếp tăng dần, nếu muốn giảm dần sử dụng -1    
        } else {
            data = await models.find()
                .populate('user_id') // Lấy thông tin của người dùng nếu cần
                .populate({
                    path: 'product.product_id', // Đường dẫn đến trường mảng product và trường product_id bên trong mảng đó
                }).sort({ createdAt: -1 }); // Sắp xếp tăng dần, nếu muốn giảm dần sử dụng -1    
        }

        return Promise.resolve(data);
    } catch (error) {
        console.log(error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}

exports.updateOder = async (data) => {
    try {
        let _id = data._id;
        let statusPay = data.statusPay
        let statusOder = data.statusOder
        let oder = await models.findOne({ _id });

        if (!oder) {
            throw new Error('Không tìm thấy đơn hàng');
        }
        if (statusPay) {
            oder.statusPay = statusPay;
        } if (statusOder) {
            console.log(oder);
            oder.statusOder = statusOder;
            if (statusOder === "5") {
                const productIdsWithQuantity = oder.product.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity
                }));
                console.log("productIdsWithQuantity", productIdsWithQuantity);
                for (const { product_id, quantity } of productIdsWithQuantity) {
                    const product = await Product.findById(product_id);
                    // console.log("product", product);
                    if (product) {
                        numberInStock = new Number(product.numberInStock)
                        console.log(numberInStock);
                        numberInStock += quantity;
                        product.numberInStock = numberInStock
                        await product.save();
                    }
                }
            }
        }
        let updatedOder = await oder.save();

        return Promise.resolve(updatedOder);
    } catch (error) {
        console.error("Lỗi khi cập nhật giỏ hàng:", error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}

exports.sendMail = async (data) => {
    try {
        console.log("sendMail 1 ");
        const priceAll = await _.formatPrice(data.totalPrice)
        // Tạo transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'chien270901@gmail.com',
                pass: 'jiqe mgwk xmjl koan',
            },
        });

        // Tạo options cho email
        const mailOptions = {
            from: 'chien270901@gmail.com',
            to: data.email,
            subject: 'Thông báo đặt hàng',
            text: `Đơn hàng của bạn đã được đặt thành công ! Tổng tiền của bạn là ${priceAll} với người nhận ${data.name} địa chỉ ${data.ward}, ${data.district}, ${data.province}. Vui lòng truy cập profile trên trang web đặt hàng để xem chi tiết đơn hàng`,
        };

        // Gửi email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return info; // Trả về thông tin về email đã gửi nếu cần thiết
    } catch (error) {
        console.error('Error occurred:', error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm nếu cần thiết
    }
};

exports.SearchOder = async (search) => {
    try {
        // Kiểm tra và chuyển đổi dữ liệu nếu cần
        // if (typeof search !== 'string') {
        //     search = search.data.toString();
        // }

        // Tìm kiếm trong cơ sở dữ liệu
        let result = await models.find({
            $or: [
                { name: { $regex: search.data, $options: 'i' } },
                { phone: { $regex: search.data, $options: 'i' } },
                { email: { $regex: search.data, $options: 'i' } },
                // Các trường tìm kiếm khác nếu cần
            ]
        }).sort({ createdAt: -1 }); // Sắp xếp tăng dần, nếu muốn giảm dần sử dụng -1    

        // Kiểm tra kết quả trả về
        if (result.length === 0) {
            return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
        }

        // Trả về kết quả cho người dùng
        return Promise.resolve(result);
    } catch (error) {
        // Xử lý lỗi
        console.log(error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}