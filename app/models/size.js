const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate');

const sizeSchema = mongoose.Schema({
    name: { type: String, required: true },
    status: { type: Boolean },
}, { timestamps: true }); // Thêm timestamps vào schema)

sizeSchema.plugin(aggregatePaginate);
const Size = mongoose.model('Sizes', sizeSchema);

module.exports = Size;
