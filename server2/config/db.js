import mongoose from 'mongoose';

const connection = async () => {
  const DB_URL = 'mongodb://localhost:27017/retailcars';
  try {
    await mongoose.connect(DB_URL);
    console.log('Database connected successfully');
  } catch (error) {
    console.log('Database connection error:', error.message);
  }
};

export default connection;
