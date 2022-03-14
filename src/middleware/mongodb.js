const mongoose = require('mongoose');

const connectDB = handler => async (ctx) => {
    if (mongoose.connections[0].readyState) {
        // Use current db connection
        return handler(ctx);
    }
    // Use new db connection
    await mongoose.connect(process.env.MONGO_DB_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
    return handler(ctx);
};

module.exports = connectDB;