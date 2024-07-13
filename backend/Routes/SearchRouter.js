const express = require("express");
const router = express.Router();
const RestaurantModel=require('../models/RestaurantData')
const userdb = require("../models/userSchema");

const mongoose = require("mongoose");

router.get("/search", async (req, res) => {
  try {
      const city = req.query.city; 
      if (!city) {
          return res.status(400).json({ error: 'City parameter is required' });
      }

      const ownerCollectionName = 'owners';

      const results = await mongoose.connection.db.collection(ownerCollectionName).find({ city: city }).toArray();
  
      res.json(results);
  } catch (error) {
      console.error('Error retrieving owners:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

  
  router.get("/restaurant", async (req, res) => {
    try {
        const city = req.query.city; 
        const restaurantName = req.query.name; 
 
        if (!city || !restaurantName) {
            return res.status(400).json({ error: 'City and restaurant parameters are required' });
        }
      
        const collectionName = `${city.toLowerCase()}_restaurants`;

        const results = await mongoose.connection.db.collection(collectionName)
            .find({ restaurant: restaurantName })
            .project({ address: 1, item: 1, price: 1,image:1 }) 
            .toArray();
        
        const resultsWithRestaurantName = results.map(result => ({
            ...result,
            restaurantName: restaurantName
        }));
        // console.log(resultsWithRestaurantName);
       return  res.json(resultsWithRestaurantName);
    
    } catch (error) {
        console.error('Error retrieving restaurant data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




router.get("/restaurant/food", async (req, res) => {
    try {
      const city = req.query.city;
      const foodName = req.query.foodName;
  
      if (!city || !foodName) {
        return res.status(400).json({ error: 'City and food parameters are required' });
      }
  
      const collectionName = `${city.toLowerCase()}_restaurants`;
  
      let results = await mongoose.connection.db.collection(collectionName)
        .find({ menu: foodName })
        .project({ address: 1, restaurant: 1, price: 1, item: 1 })
        .toArray();
  
      if (results.length === 0) {
        results = await mongoose.connection.db.collection(collectionName)
          .find({ item: foodName })
          .project({ address: 1, restaurant: 1, price: 1, item: 1 })
          .toArray();
      }
  
      res.json(results);
    } catch (error) {
      console.error('Error retrieving restaurant data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  


  router.get("/restaurant/filter/priceRange", async (req, res) => {
    try {
      const city = req.query.city;
      const maxPrice = parseInt(req.query.price);
  
      if (!city || isNaN(maxPrice)) {
        return res.status(400).json({ error: 'City and maxPrice parameter are required' });
      }
  
      const collectionName = `${city.toLowerCase()}_restaurants`;
  
      const results = await mongoose.connection.db.collection(collectionName)
        .find({ price: { $lte: maxPrice } })
        .project({ address: 1,menu:1, restaurant: 1, price: 1, item: 1,image:1 })
        .toArray();
  
      res.json(results);
    } catch (error) {
      console.error('Error retrieving restaurant data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  router.get("/user/get-cart", async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = req.session.userId;

        const user = await userdb.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const foodItems = user.cart.map(item => ({ foodItemId: item.foodItemId, quantity: item.quantity }));
        const city = user.cart.length > 0 ? user.cart[0].city : null;

        if (!city) {
            return res.status(400).json({ error: 'No city found in the user\'s cart' });
        }

        const collectionName = `${city.toLowerCase()}_restaurants`;
        const restaurants = await mongoose.connection.db.collection(collectionName)
            .find({ _id: { $in: foodItems.map(item => item.foodItemId) } })
            .toArray();

        const restaurantsWithQuantity = restaurants.map(restaurant => {
            const foodItem = foodItems.find(item => String(item.foodItemId) === String(restaurant._id));
            return { ...restaurant, quantity: foodItem ? foodItem.quantity : 0 };
        });

        res.json(restaurantsWithQuantity);
    } catch (error) {
        console.error('Error retrieving restaurant data for user cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get("/filter/breakfast", async (req, res) => {
  try {
    const { city, price } = req.query;

    if (!city || !price) {
      return res.status(400).json({ error: 'City and amount parameters are required' });
    }

    const collectionName = `${city.toLowerCase()}_restaurants`;
    const MenuItem = await mongoose.connection.db.collection(collectionName).find({
      price: { $lte: parseInt(price) },
      $and: [ // Adding $and operator
        {
          $or: [
            { item: { $in: ["Breakfast", "chai", "nasta", "Ice Tea", "Tea", "Coffee", "Milk", "Snacks", "Poha", "Evening Snacks"] } },
            { menu: { $in: ["Breakfast", "chai", "nasta", "Ice Tea", "Tea", "Coffee", "Milk", "Snacks", "Poha", "Evening Snacks"] } }
          ]
        }
      ]
    }).project({ address: 1, menu: 1, restaurant: 1, price: 1, item: 1,image:1 }).toArray();

    res.json(MenuItem);
  } catch (error) {
    console.error('Error fetching filtered data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});





router.get("/filter/lunch", async (req, res) => {
  try {
    const { city, price } = req.query;
   
    if (!city || !price) {
      return res.status(400).json({ error: 'City and amount parameters are required' });
    }

    const collectionName = `${city.toLowerCase()}_restaurants`;
    const MenuItem = await mongoose.connection.db.collection(collectionName).find({
      price: { $lte: parseInt(price) },
      $and: [ // Adding $and operator
        {
          $or: [
            { item: { $in: ["Dinner","Thalis", "Meal in bowl", "Indian", "roti", "contenental", "Indian Main Course", "chinese", "Pizza", "Burger"] } },
            { menu: { $in: ["Dinner","Thalis", "Meal in bowl", "Indian", "roti", "contenental", "Indian Main Course", "chinese", "Pizza", "Burger"] } }
          ]
        }
      ]
    }).project({ address: 1, menu: 1, restaurant: 1, price: 1, item: 1,image:1 }).toArray();

    res.json(MenuItem);
  } catch (error) {
    console.error('Error fetching filtered data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get("/filter/dinner", async (req, res) => {
  try {
    const { city, price } = req.query;
    console.log(city);
    console.log(price);
    if (!city || !price) {
      return res.status(400).json({ error: 'City and amount parameters are required' });
    }

    const collectionName = `${city.toLowerCase()}_restaurants`;
    const MenuItem = await mongoose.connection.db.collection(collectionName).find({
      price: { $lte: parseInt(price) },
      $and: [ 
        {
          $or: [
            { item: { $in: ["Dinner","Thalis", "Meal in bowl", "Indian", "roti", "contenental", "Indian Main Course", "chinese", "Pizza", "Burger"] } },
            { menu: { $in: ["Dinner","Lunch","Thalis", "Meal in bowl", "Indian", "roti", "contenental", "Indian Main Course", "chinese", "Pizza", "Burger"] } }
          ]
        }
      ]
    }).project({ address: 1, menu: 1, restaurant: 1, price: 1, item: 1,image:1}).toArray();

    res.json(MenuItem);
  } catch (error) {
    console.error('Error fetching filtered data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




router.get("/filter/day", async (req, res) => {
  try {
    const { city, price } = req.query;
  
    if (!city || !price) {
      return res.status(400).json({ error: 'City and amount parameters are required' });
    }

    const collectionName = `${city.toLowerCase()}_restaurants`;
    const lunchanddinnerdata = await mongoose.connection.db.collection(collectionName).find({
      price: { $lte: parseInt(price) },
      $and: [ 
        {
          $or: [
            { item: { $in: ["Thalis", "Meal in bowl", "Indian", "roti", "contenental", "Indian Main Course", "chinese", "Pizza", "Burger"] } },
            { menu: { $in: ["Dinner","Lunch","Thalis", "Meal in bowl", "Indian", "roti", "contenental", "Indian Main Course", "chinese", "Pizza", "Burger"] } }
          ]
        }
      ]
    }).project({ address: 1, menu: 1, restaurant: 1, price: 1, item: 1,image:1 }).toArray();


    const breakfastdata = await mongoose.connection.db.collection(collectionName).find({
      price: { $lte: parseInt(price) },
      $and: [ // Adding $and operator
        {
          $or: [
            { item: { $in: ["Breakfast", "chai", "nasta", "Ice Tea", "Tea", "Coffee", "Milk", "Snacks", "Poha", "Evening Snacks"] } },
            { menu: { $in: ["Breakfast", "chai", "nasta", "Ice Tea", "Tea", "Coffee", "Milk", "Snacks", "Poha", "Evening Snacks"] } }
          ]
        }
      ]
    }).project({ address: 1, menu: 1, restaurant: 1, price: 1, item: 1 }).toArray();


    res.json({ lunchanddinnerdata, breakfastdata });
  } catch (error) {
    console.error('Error fetching filtered data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});








module.exports=router;  
  
  