const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect(
     `${process.env.URI}`    
    );
    console.log("data conected sucessfully");
    
  } catch (error) {
    console.log(error);
  }
};

connection();
