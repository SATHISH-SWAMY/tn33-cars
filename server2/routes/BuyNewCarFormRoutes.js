import express from 'express'   
import { addbuyNewCarForm } from '../controllers/BuyNewFormController.js'

const router = express.Router();

router.post('/NewCarForm' ,  addbuyNewCarForm);

export default router;  