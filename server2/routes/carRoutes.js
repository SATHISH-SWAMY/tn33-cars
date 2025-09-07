import express from 'express';
import upload from '../middleware/upload.js';
import { addCar, getCars ,filterCar ,updateCar ,deleteCar ,toggleSoldOut  } from '../controllers/carController.js';

const router = express.Router();

router.post('/add-car', upload.array('images', 100), addCar);
router.put("/update-Car/:id", upload.array("images"), updateCar);
router.put("/toggle-soldout/:id", toggleSoldOut);
router.delete("/delete-car/:id", deleteCar);
router.get('/get-cars', getCars);
router.get('/filter-cars', filterCar);

export default router;
