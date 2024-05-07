const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate');

const OderSchema = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    product: [{
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' },
        quantity: { type: Number, default: 1 }
    }],
    name: { type: String, require: true },
    phone: { type: String, require: true },
    email: { type: String, require: true },
    note: { type: String, require: true },
    address: { type: String, require: true },// Địa chỉ
    ward: { type: String, require: true }, // Xã/Phường
    district: { type: String, require: true },// Quận Huyện
    province: { type: String, require: true },// Tỉnh Thành Phố
    typePay: { type: String, require: true },// 0: Khi nhận hàng 1: Chuyển khoản
    totalPrice: { type: String, require: true },
    statusPay: { type: String, require: true },//0: Chờ xác nhận/ 1:Xác nhận
    statusOder: { type: String, require: true },//0: Chờ xác nhận/ 1:Xác nhận/ 2:Đang giao/ 3:GH Thành công /4: GH that bai/ 5: huy don
}, { timestamps: true });

OderSchema.plugin(aggregatePaginate);
const Oder = mongoose.model('Oders', OderSchema);

module.exports = Oder;
