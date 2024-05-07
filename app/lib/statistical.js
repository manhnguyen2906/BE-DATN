let Order = require('../models/oder');
let Product = require('../models/products');
let User = require('../models/user');
var nodemailer = require("nodemailer");
let moment = require("moment");
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


exports.allOrder = async (type) => {
    try {
        let startDate, endDate;
        if (type === 'year') {
            startDate = moment().startOf('year');
            endDate = moment().endOf('year');
        } else if (type === 'month') {
            startDate = moment().startOf('month');
            endDate = moment().endOf('month');
        } else if (type === 'day') {
            startDate = moment().startOf('day');
            endDate = moment().endOf('day');
        } else {
            return Promise.reject({ show: true, message: "Type không hợp lệ" });
        }

        let agg = [
            {
                $match: {
                    createdAt: {
                        $gte: startDate.toDate(),
                        $lte: endDate.toDate()
                    },
                    statusOder: { $nin: ["0", "1", "2", "4", "5"] } // Loại bỏ trường hợp statusOder bằng 5

                }

            }
        ];
        if (type === 'year') {
            agg.push(
                {
                    $addFields: {
                        totalPriceNum: {
                            $convert: {
                                input: "$totalPrice",
                                to: "decimal"
                            }
                        },
                        month: { $month: "$createdAt" } // Thêm trường month từ createdAt
                    }
                },
                {
                    $group: {
                        _id: { year: { $year: "$createdAt" }, month: "$month" }, // Gộp theo năm và tháng
                        totalOrders: { $sum: 1 },
                        totalRevenue: { $sum: "$totalPriceNum" }
                    }
                },
                {
                    $sort: { "_id.month": 1 } // Sắp xếp theo tháng
                }
            );
        } else if (type === 'month') {
            agg.push(
                {
                    $addFields: {
                        totalPriceNum: {
                            $convert: {
                                input: "$totalPrice",
                                to: "decimal"
                            }
                        },
                        day: { $dayOfMonth: "$createdAt" } // Thêm trường day từ createdAt
                    }
                },
                {
                    $group: {
                        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" }, day: "$day" }, // Gộp theo năm, tháng và ngày
                        totalOrders: { $sum: 1 },
                        totalRevenue: { $sum: "$totalPriceNum" }
                    }
                },
                {
                    $sort: { "_id.day": 1 } // Sắp xếp theo ngày
                }
            );
        } else if (type === 'day') {
            agg.push(
                {
                    $addFields: {
                        totalPriceNum: {
                            $convert: {
                                input: "$totalPrice",
                                to: "decimal"
                            }
                        },
                        hour: { $hour: "$createdAt" } // Thêm trường hour từ createdAt
                    }
                },
                {
                    $group: {
                        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" }, hour: "$hour" }, // Gộp theo năm, tháng, ngày và giờ
                        totalOrders: { $sum: 1 },
                        totalRevenue: { $sum: "$totalPriceNum" }
                    }
                },
                {
                    $sort: { "_id.hour": 1 } // Sắp xếp theo giờ
                }
            );
        }

        console.log(JSON.stringify(agg));
        let data = await Order.aggregate(agg);
        return Promise.resolve(data);

    } catch (error) {
        console.log(error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
};
exports.allUser = async () => {
    try {
        let data = await User.find()
            .populate('user_id') // Lấy thông tin của người dùng nếu cần
            .populate({
                path: 'product.product_id', // Đường dẫn đến trường mảng product và trường product_id bên trong mảng đó
            });

        return Promise.resolve(data);
    } catch (error) {
        console.log(error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}
exports.allProduct = async () => {
    try {
        let data = await Product.find()
            .populate('user_id') // Lấy thông tin của người dùng nếu cần
            .populate({
                path: 'product.product_id', // Đường dẫn đến trường mảng product và trường product_id bên trong mảng đó
            });

        return Promise.resolve(data);
    } catch (error) {
        console.log(error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}




