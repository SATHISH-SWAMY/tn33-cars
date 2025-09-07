import express from 'express';
import upload from '../middleware/upload.js';
import { addSaleForm } from '../controllers/saleFormController.js';

const router = express.Router();

router.post('/oldcars', upload.array('images', 10), addSaleForm);

export default router;
