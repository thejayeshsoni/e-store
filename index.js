const app = require("./app");
const connectDB = require("./configs/db");
require("dotenv").config();
const cloudinary = require("cloudinary");

connectDB();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.listen(process.env.PORT, () => {
    console.log(`Server is Listening at ${process.env.PORT}`);
});