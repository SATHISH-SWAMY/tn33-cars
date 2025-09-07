import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  model: { type: String, required: true },
  fuel: { type: String, required: true },
  service: { type: String },     
  Mode: { type: String },        
  location: { type: String },    
  negotiation: { type: String }, 
  bank: { type: String },        
  KMdriven: { type: Number, required: true },
  Transmission: { type: Number, required: true },
  Enginecapacity: { type: String, required: true },
  Ownership: { type: String, required: true },
  Makeyear: { type: Number, required: true },
  Regnumber: { type: String, required: true },
  Insurance: { type: String, required: true },
  year: Number,
  color: String,
  price: { type: Number, required: true },
  date: String,
  time: String,
  images: [String], // Base64 strings
  soldOut: { type: Boolean, default: false }
});

export default mongoose.model('Car', carSchema);
