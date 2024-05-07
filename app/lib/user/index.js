const models = require('../../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.Signup = async (req, body = {}) => {
    try {
        const { name, phone, email, password, role } = req.body;
        console.log(req.body);
        // Kiểm tra xem các trường bắt buộc đã được điền đầy đủ hay không
        if (!name || !phone || !email || !password) {
            return Promise.reject({ show: true, message: "Vui lòng điền đầy đủ thông tin" });
        }

        // Kiểm tra xem người dùng đã tồn tại hay chưa
        const userExists = await models.findOne({ $or: [{ phone }, { email }] });
        if (userExists) {
            return Promise.reject({ show: true, message: "Người dùng đã tồn tại" });
        }

        // Hash mật khẩu
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("hashedPassword", hashedPassword);
        // Tạo người dùng mới với mật khẩu đã được hash
        const newUser = await models.create({ name, phone, email, password: hashedPassword, role });

        // Trả về thông báo thành công và người dùng đã tạo nếu không có lỗi
        return Promise.resolve(newUser);
    } catch (error) {
        console.error("Error creating User:", error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}
exports.Login = async (req, body = {}) => {
    try {
        const { email, password } = req;
        let user;

        // Kiểm tra xem người dùng đã cung cấp email hoặc số điện thoại chưa
        if (!email) {
            return Promise.reject({ show: true, message: "Vui lòng nhập email hoặc số điện thoại" });
        }
        user = await models.findOne({ email: email });

        if (!user) {
            // Không tìm thấy người dùng với thông tin đăng nhập đã nhập
            return Promise.reject({ show: true, message: "Thông tin đăng nhập không tồn tại" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            delete user.password; // Xóa mật khẩu trước khi trả về thông tin người dùng
            return Promise.resolve({ user });
        } else {
            // Mật khẩu không khớp
            return Promise.reject({ show: true, message: "Mật khẩu không đúng" });
        }
    } catch (error) {
        // Bắt và xử lý lỗi nếu có
        console.error("Error logging in:", error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
};
// exports.createUser = async (req, body = {}) => {
//     try {
//         let errors = [];
//         const { name, phone, email, password, status } = req.body;
//         const imagePath = req.file.path; // Đường dẫn của hình ảnh đã được lưu trữ trong req.file
//         const imageFileNameWithoutPath = path.basename(imagePath); // Lấy tên tệp từ đường dẫn đầy đủ
//         const image = '/images/' + imageFileNameWithoutPath; // Đường dẫn cố định của hình ảnh
//         // console.log("non the nho", data);
//         if (name && email && phone) {
//             let checkExists1 = await models.findOne({ name });
//             let checkExists2 = await models.findOne({ email });
//             let checkExists3 = await models.findOne({ phone });
//             if (checkExists1 && checkExists2 && checkExists3) {
//                 errors.push({ 'label': 'user_exist', 'message': 'Tài khoản đã tồn tại' });
//                 return Promise.reject({ show: true, message: errors });
//             }
//         }
//         // Thực hiện tạo tài khoản
//         let created = await models.create({ name, phone, email, password, image, status });

//         // Trả về thông báo thành công nếu tạo sản phẩm thành công
//         return Promise.resolve(created);
//     } catch (error) {
//         // Bắt và xử lý lỗi nếu có
//         console.error("Error creating Brand:", error);
//         return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
//     }
// }

exports.allUser = async () => {
    try {
        let data = await models.find().sort({ createdAt: -1 }); // Sắp xếp tăng dần, nếu muốn giảm dần sử dụng -1    
        console.log("data");
        return Promise.resolve(data);
    } catch (error) {
        console.log(error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}
exports.updateUser = async (id, body = {}) => {
    try {
        let updated = await models.findByIdAndUpdate(id, body, { new: true });
        return Promisebb.resolve(updated);
    } catch (error) {
        // Bắt và xử lý lỗi nếu có
        console.error("Error updating User:", error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}
exports.deleteUser = async (id) => {
    try {
        const User = await models.findById(id);
        const imagePath = User.image;
        let deleted = await models.findByIdAndRemove({ _id: id });
        fs.unlinkSync(imagePath); // Xóa hình ảnh từ thư mục
        return Promise.resolve(deleted);
    } catch (error) {
        console.error("Error delete User:", error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}

exports.SearchUser = async (search) => {
    try {

        // Tìm kiếm trong cơ sở dữ liệu
        let result = await models.find({
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { role: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
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