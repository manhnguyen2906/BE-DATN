const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate');

const brandSchema = mongoose.Schema({
    name: { type: String, required: true },
    emailBrand: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: Boolean },
}, { timestamps: true }); // Thêm timestamps vào schema)

brandSchema.plugin(aggregatePaginate);
const Brand = mongoose.model('Brands', brandSchema);

module.exports = Brand;
