let models = require('../../models/size');

// const Joi = require('joi');
// const Promisebb = require('bluebird')
// const _ = require('lodash');
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
exports.createSize = async (data, body = {}) => {
    try {
        let errors = [];
        const { name, status } = data;
        // console.log("non the nho", data);
        if (name) {
            let checkExists1 = await models.findOne({ name });
            if (checkExists1) {
                errors.push({ 'label': 'Size_exist', 'message': 'Size đã tồn tại' });
                return Promise.reject({ show: true, message: errors });
            }
        }
        // Thực hiện tạo size
        let created = await models.create({ name, status });

        // Trả về thông báo thành công nếu tạo size thành công
        return Promise.resolve(created);
    } catch (error) {
        // Bắt và xử lý lỗi nếu có
        console.error("Error creating Size:", error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}

exports.allSize = async () => {
    try {
        let data = await models.find().sort({ createdAt: -1 }); // Sắp xếp tăng dần, nếu muốn giảm dần sử dụng -1    
        console.log("data");
        return Promise.resolve(data);
    } catch (error) {
        console.log(error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}
exports.allSizeOn = async () => {
    try {
        let data = await models.find({ status: "1" }).sort({ createdAt: -1 }); // Sắp xếp tăng dần, nếu muốn giảm dần sử dụng -1    
        console.log("data");
        return Promise.resolve(data);
    } catch (error) {
        console.log(error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}
exports.updateSize = async (id, body = {}) => {
    try {
        let updated = await models.findByIdAndUpdate(id, body, { new: true });
        return Promise.resolve(updated);
    } catch (error) {
        // Bắt và xử lý lỗi nếu có
        console.error("Error updating Size:", error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}
exports.deleteSize = async (id) => {
    try {
        let deleted = await models.findByIdAndRemove({ _id: id });
        return Promise.resolve(deleted);
    } catch (error) {
        console.error("Error delete Size:", error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}

exports.searchSize = async (search) => {
    try {

        // Tìm kiếm trong cơ sở dữ liệu
        let result = await models.find({
            $or: [
                { name: { $regex: search, $options: 'i' } }
            ]
        });

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