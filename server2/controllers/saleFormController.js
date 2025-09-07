import fs from 'fs';
import SaleForm from '../models/SaleForm.js';

export const addSaleForm = async (req, res) => {
  try {
    const images = req.files.map(file => {
      const buffer = fs.readFileSync(file.path);
      return `data:${file.mimetype};base64,${buffer.toString('base64')}`;
    });

    const newSaleForm = new SaleForm({ ...req.body, images });
    await newSaleForm.save();

    res.status(200).json({ success: true, message: 'SaleForm added successfully', data: newSaleForm });
  } catch (error) {
    console.error('Error adding SaleForm:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
