const mongoose = require('mongoose');

const connectDatabaseMongoose = async () => {
    try {
        const db = await mongoose.connect('mongodb://localhost:27017/KingShoes', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log("Kết nối thành công với localhost MongoDB");
    } catch (error) {
        console.error("Lỗi kết nối với localhost MongoDB:", error);
    }
};

module.exports = connectDatabaseMongoose;
