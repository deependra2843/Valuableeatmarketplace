const express = require("express");
const router = express();
const stripe = require("stripe")("sk_test_51OubQfSFJtNK47N3ATun2p9VAGJ5FUwWTrrYmyWVGpLQ4x4mdeO3AUunR0Z2bUi1JPNP7YiOp1bcUojqena03nlj0045DYX0ER");
const cors = require("cors");
router.use(cors());


router.post("/api/create-checkout-session",async(req,res)=>{
    const {products} = req.body;
   console.log(products);

    const lineItems = products.map((product)=>({
        price_data:{
            currency:"inr",
            product_data:{
                // name:product.dish,
                // images:[product.imgdata]
            },
            unit_amount: 100,
        },
        // quantity:product.qnty
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items:lineItems,
        mode:"payment",
 
        success_url:"http://localhost:3000/sucess",
        cancel_url:"http://localhost:3000/cancel",
        
        
    });
   

    res.json({id:session.id})
 
})
module.exports=router;