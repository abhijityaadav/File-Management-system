const mongoose = require('mongoose');
require('dotenv').config();

const connectionToDatabase = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI is not defined in the .env file.');
        }
        await mongoose.connect(uri); 
        console.log('Database connected successfully!');
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};

module.exports = { connectionToDatabase };
