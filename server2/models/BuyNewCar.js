import mongoose from "mongoose";

const buyNewCarSchema = new mongoose.Schema({
    name: String,
    constactNumber: Number,
    budget: Number,
    preferredBrand: String,
    preferredCarModel: String,
    YourLocation: String,
    drivingPreference: String,
    kilometersDrivenPerYear: Number,
    BuyingTimeframe: Number

});

export default mongoose.model('buyingNewCarform' , buyNewCarSchema)