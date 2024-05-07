const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate');

const productSchema = mongoose.Schema({
    name: { type: String },
    description: { type: String },
    status: { type: String },
    image: { type: String, require: true }, // Lưu trữ đường dẫn của hình ảnh
    price: { type: String },
    sellingPrice: { type: String },
    numberInStock: { type: String },
    product_type: { type: String },
    brand_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Brands' },
    size_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sizes' },
    status: { type: Boolean },
}, { timestamps: true }); // Thêm timestamps vào schema)

productSchema.plugin(aggregatePaginate);
const Product = mongoose.model('Products', productSchema);

module.exports = Product;