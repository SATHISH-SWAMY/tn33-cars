import fs from 'fs';
import Car from '../models/Car.js';

export const addCar = async (req, res) => {
  try {
    const images = req.files.map(file => {
      const buffer = fs.readFileSync(file.path);
      return `data:${file.mimetype};base64,${buffer.toString('base64')}`;
    });

    const newCar = new Car({ ...req.body, images });
    await newCar.save();

    res.status(200).json({ success: true, message: 'Car added successfully', data: newCar });
  } catch (error) {
    console.error('Error adding car:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const toggleSoldOut = async (req, res) => {
  try {
    const { id } = req.params;

    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    car.soldOut = !car.soldOut;
    await car.save();

    res.status(200).json({
      success: true,
      message: `Car marked as ${car.soldOut ? "Sold Out" : "Available"}`,
      data: car,
    });
  } catch (error) {
    console.error("Error toggling soldOut:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update Car
export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;

    let updateData = { ...req.body };

    // Handle images if uploaded
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file) => {
        const buffer = fs.readFileSync(file.path);
        return `data:${file.mimetype};base64,${buffer.toString("base64")}`;
      });
      updateData.images = images;
    }

    const updatedCar = await Car.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedCar) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    res.status(200).json({
      success: true,
      message: "Car updated successfully",
      data: updatedCar,
    });
  } catch (error) {
    console.error("Error updating car:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    

    const deletedCar = await Car.findByIdAndDelete(id);

    if (!deletedCar) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    res.status(200).json({ success: true, message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ success: false, message: "Server error while deleting car" });
  }
};

export const getCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cars' });
  }
};


export const filterCar = async (req , res)=>{
  try {
    const { carType , carMarket ,priceing } = req.query;

    const filter = {};

    if(carType){
      filter.model = { $regex: carType, $options: 'i'}; //case-insensitive
    }
    if(carMarket){
      filter.name = { $regex: carMarket, $options: 'i'}; //case-insensitive
    }
    if(priceing){
      const [min , max] = priceing.split('-').map(Number);
      if(!isNaN(min) && !isNaN(max)){
        filter.price = { $gte: min, $lte: max };
      }
    }

    const filteredCars = await Car.find(filter);
    res.status(200).json({success: true, data: filteredCars});
  } catch (error) {
    res.status(500).json({ success: false , message: 'Server error while filtering cars' });
  }
}
