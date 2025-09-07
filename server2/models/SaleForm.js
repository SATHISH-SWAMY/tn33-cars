import mongoose from 'mongoose';

const saleFormSchema = new mongoose.Schema({
  brand: String,
  condition: String,
  contact: Number,
  fuel: String,
  kms: String,
  location: String,
  model: Number,
  name: String,
  ownership: String,
  year: Number,
  price: Number,
  date: String,
  time: String,
  images: [String],
  payment_id: String,
});

export default mongoose.model('SaleForm', saleFormSchema);
