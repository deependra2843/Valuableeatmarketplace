const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    
 
    order_date: {
        type: Date,
        default: Date.now
    },
    total_amount: {
        type: Number,
        required: true
    },
    cart: [
        {
            city: {
                type: String,
            },
            foodItemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'FoodItem',
           
            },
            owner:{
                type: mongoose.Schema.Types.ObjectId,

            },
            Itemname:{
                type:String
            },
            price:{
                type:Number
            },
            quantity: {
                type: String,
                default: 1
            }
        }
    ]
   
});

const OrderModel = mongoose.model("Order", orderSchema);

module.exports = OrderModel;
