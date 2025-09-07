import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  password: String,
  // googleId: String,
});

export default mongoose.model('User', userSchema);
