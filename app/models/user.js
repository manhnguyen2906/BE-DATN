const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate');

const userSchema = mongoose.Schema({
    name: { type: String, require: true },
    phone: { type: String, require: true },
    password: { type: String, require: true },
    image: { type: String }, // Lưu trữ đường dẫn của hình ảnh
    email: { type: String, require: true },
    role: { type: String, require: true },
    status: { type: Boolean },
}, { timestamps: true }); // Thêm timestamps vào schema)

userSchema.plugin(aggregatePaginate);
const User = mongoose.model('Users', userSchema);

module.exports = User;