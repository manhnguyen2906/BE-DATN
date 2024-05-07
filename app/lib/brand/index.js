let models = require('../../models/brands');
const fs = require('fs'); // Khai báo mô-đun fs

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
exports.createBrand = async (req, body = {}) => {
    try {
        let errors = [];
        const { name, emailBrand, phoneNumber, address } = req.body;
        const imagePath = req.file.path; // Đường dẫn của hình ảnh đã được lưu trữ trong req.file
        const imageFileNameWithoutPath = path.basename(imagePath); // Lấy tên tệp từ đường dẫn đầy đủ
        const image = '/images/' + imageFileNameWithoutPath; // Đường dẫn cố định của hình ảnh
        // console.log("non the nho", data);
        if (name && emailBrand && phoneNumber) {
            let checkExists1 = await models.findOne({ name });
            let checkExists2 = await models.findOne({ emailBrand });
            let checkExists3 = await models.findOne({ phoneNumber });
            if (checkExists1 && checkExists2 && checkExists3) {
                errors.push({ 'label': 'brand_exist', 'message': 'Nhãn hàng đã tồn tại' });
                return Promise.reject({ show: true, message: errors });
            }
        }
        // Thực hiện tạo sản phẩm
        let created = await models.create({ name, emailBrand, phoneNumber, address, image });

        // Trả về thông báo thành công nếu tạo sản phẩm thành công
        return Promise.resolve(created);
    } catch (error) {
        // Bắt và xử lý lỗi nếu có
        console.error("Error creating Brand:", error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}

exports.allBrand = async () => {
    try {
        let data = await models.find().sort({ createdAt: -1 }); // Sắp xếp tăng dần, nếu muốn giảm dần sử dụng -1    
        console.log("data");
        return Promise.resolve(data);
    } catch (error) {
        console.log(error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}
exports.allBrandOn = async () => {
    try {
        let data = await models.find({ status: "1" }).sort({ createdAt: -1 }); // Sắp xếp tăng dần, nếu muốn giảm dần sử dụng -1    
        console.log("data");
        return Promise.resolve(data);
    } catch (error) {
        console.log(error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}
exports.updateBrand = async (id, req) => {
    try {
        console.log("data checkk id", id);
        console.log("data checkk", req.body);
        const brand = await models.findById(id);
        if (!brand) {
            return Promise.reject({ show: true, message: "Không tìm thấy sản phẩm để xóa" });
        }
        if (req.file) {
            const imagePath = req.file.path; // Đường dẫn của hình ảnh đã được lưu trữ trong req.file
            const imageFileNameWithoutPath = path.basename(imagePath); // Lấy tên tệp từ đường dẫn đầy đủ
            const image = '/images/' + imageFileNameWithoutPath; // Đường dẫn cố định của hình ảnh
            req.body.image = image;
            const imagePathDelete = brand.image;
            const imagePathFull = `D:\\MyProject\\KingShoes\\public` + imagePathDelete;
            if (fs.existsSync(imagePathFull)) {
                fs.unlinkSync(imagePathFull); // Xóa hình ảnh từ thư mục
            }
        }


        let updated = await models.findByIdAndUpdate(id, req.body, { new: true });
        return Promise.resolve(updated);
    } catch (error) {
        // Bắt và xử lý lỗi nếu có
        console.error("Error updating Brand:", error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}
exports.deleteBrand = async (id) => {
    try {
        const brand = await models.findById(id);
        if (!brand) {
            return Promise.reject({ show: true, message: "Không tìm thấy sản phẩm để xóa" });
        }

        const imagePathDelete = brand.image;
        const imagePathFull = `D:\\MyProject\\KingShoes\\public` + imagePathDelete;
        if (fs.existsSync(imagePathFull)) {
            fs.unlinkSync(imagePathFull); // Xóa hình ảnh từ thư mục
        } // Xóa hình ảnh từ thư mục
        let deleted = await models.findByIdAndRemove({ _id: id });
        return Promise.resolve(deleted);
    } catch (error) {
        console.error("Error delete Brand:", error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}

exports.searchBrand = async (search) => {
    try {

        // Tìm kiếm trong cơ sở dữ liệu
        let result = await models.find({
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                // { role: { $regex: search, $options: 'i' } },
                // { email: { $regex: search, $options: 'i' } },
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