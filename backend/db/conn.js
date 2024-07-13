const mongoose = require("mongoose");



try {
    mongoose.connect("mongodb+srv://valuableeatsmarketplace:root@cluster0.4zuuj83.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(() => {
      console.log("connected");
    });
  } catch (e) {
    console.log(e);
  }