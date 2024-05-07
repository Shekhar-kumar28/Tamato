import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://sk164949:Shekhar123@cluster0.utvv8iy.mongodb.net/food-del')
    .then(() => {
        console.log("Database connected");
    });
};
// module.exports = connectDB;

