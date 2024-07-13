const express = require("express");
const app = express();
require("./db/conn");
const UserRoute = require("./Routes/UserRoute");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const restaurantdata = require('./Routes/SearchRouter');
const paymentroute=require('./Routes/paymentroute');
const port = 8009;
const stripe = require("stripe")("sk_test_51OubQfSFJtNK47N3ATun2p9VAGJ5FUwWTrrYmyWVGpLQ4x4mdeO3AUunR0Z2bUi1JPNP7YiOp1bcUojqena03nlj0045DYX0ER");

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:3000", // Replace with the actual origin of your frontend application
    credentials: true
}));
// Express session configuration
app.use(session({
    secret: "your_secret_key", // Replace with a random secret key
    resave: false,
    saveUninitialized: false
}));
app.post("/api/create-checkout-session",async(req,res)=>{
    const {products} = req.body;
   console.log(products);

    const lineItems = products.map((product)=>({
        price_data:{
            currency:"inr",
            product_data:{
                name:product.item,
             
            },
            unit_amount: product.price*100,
        },
        quantity:product.quantity
    }));

    const sessionpayment = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items:lineItems,
        mode:"payment",
 
        success_url:"http://localhost:3000/sucess",
        cancel_url:"http://localhost:3000/cancel",
        
        
    });
   

    res.json({id:sessionpayment.id})
 
})

// Routes
app.use(UserRoute);
app.use(restaurantdata);
// app.use(paymentroute);
app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});
