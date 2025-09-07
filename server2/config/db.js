import mongoose from 'mongoose';

const connection = async () => {
  const DB_URL = 'mongodb+srv://sathishfabdiz_db_user:FF4OG8vCJBNXmJTL@tn33cars.ploesny.mongodb.net/retailcars?retryWrites=true&w=majority&appName=tn33cars';
  try {
    await mongoose.connect(DB_URL);
    console.log('Database connected successfully');
  } catch (error) {
    console.log('Database connection error:', error.message);
  }
};

export default connection;
