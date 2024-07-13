const mongoose = require("mongoose");




const restaurantSchema = new mongoose.Schema({
    // Define schema fields based on your CSV columns
    city: String,
    cityLink: String,
    
    restaurantCode: String,
    restaurant: String,
    rating: String,
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    ratingCount: String,
    cost: String,
    address: String,
    cuisine: String,
    licenseNo: String,
    restaurantLink: String,
    menu: String,
    item: String,
    price: Number,
    vegOrNonVeg: String
});

const RestaurantModel = mongoose.model("Restaurant",restaurantSchema);

module.exports=RestaurantModel
