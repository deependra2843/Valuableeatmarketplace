const express = require("express");
const router = new express.Router();
const userdb = require("../models/userSchema");
const orderdb=require("../models/orderData");
var bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");
const mongoose = require("mongoose");


router.get("/userid", async(req, res) => {

    const userId =  req.session.userId;


  
    
    if (userId) {
        res.status(200).json({ userId });
    } else {
        res.status(401).json({ error: "User ID not found in session" });
    }
});




router.post("/register", async (req, res) => {
        
 
    const { fname, email, password, cpassword } = req.body;

    if (!fname || !email || !password || !cpassword) {
        res.status(422).json({ error: "fill all the details" })
    }

    try {

        const preuser = await userdb.findOne({ email: email });

        if (preuser) {
            res.status(422).json({ error: "This Email is Already Exist" })
        } else if (password !== cpassword) {
            res.status(422).json({ error: "Password and Confirm Password Not Match" })
        } else {
            const finalUser = new userdb({
                fname, email, password, cpassword
            });

            // here password hasing

            const storeData = await finalUser.save();

            // console.log(storeData);
            res.status(201).json({ status: 201, storeData })
        }

    } catch (error) {
        res.status(422).json(error);
        console.log("catch block error");
    }

});


router.post("/login", async (req, res) => {
    // console.log(req.body);

    const { email, password } = req.body;

    if (!email || !password) {
        res.status(422).json({ error: "fill all the details" })
    }

    try {
       const userValid = await userdb.findOne({email:email});
   
        if(userValid){
      
            const isMatch = await bcrypt.compare(password,userValid.password);

            if(!isMatch){
         
                res.status(422).json({ error: "invalid details"})
            }else{

                // token generate
                console.log("Session ID:", req.sessionID);
                console.log("User ID:", userValid._id);

                req.session.userId = userValid._id;
req.session.save();
                const token = await userValid.generateAuthtoken();

                // cookiegenerate
                res.cookie("usercookie",token,{
                    expires:new Date(Date.now()+60000),
                    httpOnly:true
                });

                const result = {
                    userValid,
                    token,
                    userId: req.session.userId
                }
                res.status(201).json({status:201,result})
            }
        }

    } catch (error) {
        res.status(401).json(error);


        console.log("catch block");
    }
});



// user valid
router.get("/validuser",async(req,res)=>{
    try {
        // const ValidUserOne = await userdb.findOne({_id:req.userId});
        const useriD=req.session.userId;
      
        const user= await userdb.findById(useriD);
        if(useriD!=null){
        res.status(201).json({status:201,user});
        }
    } catch (error) {
        res.status(401).json({status:401,error});
    }
});



// user logout

router.get("/logout",async(req,res)=>{
    try {
        delete req.session.userId;


        res.status(201).json({status:201})

    } catch (error) {
        res.status(401).json({status:401,error})
    }
})



router.post('/user/update-cart', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = req.session.userId;
        const { city, restaurantId } = req.body;

        const user = await userdb.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // const existingCartItemIndex = user.cart.findIndex(item => {
        //     if (item && item.foodItemId) {
        //         return item.foodItemId.toString() === foodItemId;
        //     }
        //     return false; 
        // });
        
        // if (existingCartItemIndex === -1) {
            user.cart.push({
                city: city,
                foodItemId: restaurantId,
                quantity: 1  
            });
        // } else {
        //     // Food item already exists in the cart, update the quantity or take other action if needed
        //     // For example, you might want to increase the quantity of the existing item
        //     // user.cart[existingCartItemIndex].quantity++;
        // }

        await user.save();

        return res.status(200).json({ message: 'Item added to cart successfully' });
    } catch (error) {
        console.error('Error updating cart:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});



router.post('/update-quantity', async (req, res) => {
    try {
        const userId = req.session.userId; // Get the user ID from the session
        const { itemId, newQuantity } = req.body;

        const user = await userdb.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const cartItemIndex = user.cart.findIndex(item => item.foodItemId.toString() === itemId);
        if (cartItemIndex === -1) {
            return res.status(404).json({ error: 'Item not found in the user\'s cart' });
        }

        user.cart[cartItemIndex].quantity = newQuantity;
        await user.save();

        res.json(user);
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.post('/get-quantities', async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        const { itemId } = req.body;
        
        const user = await userdb.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const item = user.cart.find(cartItem => cartItem.foodItemId.toString() === itemId);
        if (!item) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }
        
        res.json({ quantity: item.quantity });
    } catch (error) {
        console.error('Error fetching quantity:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/remove-from-cart',async (req,res)=>{
try{
    const userId = req.session.userId;
const {itemId}=req.body;
const user=await userdb.findById(userId);
if (user) {
    const index = user.cart.findIndex(item => item.foodItemId.toString() === itemId.toString());

    if (index !== -1) {
        user.cart.splice(index, 1);

        await user.save();

        res.json(user.cart);
    } else {
        res.status(404).json({ error: 'Item not found in the cart' });
    }
} else {
    res.status(404).json({ error: 'User not found' });
}

}
catch(error){
}

});


router.post("/api/save-orders", async (req, res) => {
    try {
        const userId = req.session.userId; 
        const user = await userdb.findById(userId); 

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updatedCart = await Promise.all(user.cart.map(async (item) => {
            const cityRestaurantCollection = mongoose.connection.db.collection(`${item.city.toLowerCase()}_restaurants`);
            const foodItem = await cityRestaurantCollection.findOne({ _id: item.foodItemId });
            if (!foodItem) {
                throw new Error(`Food item with ID ${item.foodItemId} not found in city ${item.city}`);
            }

            return {
                ...item,
                Itemname: foodItem.item,
                owner:foodItem.owner,
                price: foodItem.price
            };
        }));

        const newOrder = new orderdb({
            user_id: userId, 
            total_amount: req.body.price,
            cart: updatedCart 
        });

        await newOrder.save();

        res.status(200).json({ message: 'Order saved successfully' });
    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.post("/get-order", async (req, res) => {
    try {
        const userId = req.session.userId; 
        
        
        const userOrders = await orderdb.find({ user_id: userId });

    
        res.status(200).json({ orders: userOrders });
    } catch (error) {
        console.error('Error retrieving orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});





module.exports = router;



// 2 way connection
// 12345 ---> e#@$hagsjd
// e#@$hagsjd -->  12345

// hashing compare
// 1 way connection
// 1234 ->> e#@$hagsjd
// 1234->> (e#@$hagsjd,e#@$hagsjd)=> true



