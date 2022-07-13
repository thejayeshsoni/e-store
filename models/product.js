const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a product name.."],
        trim: true,
        maxLength: [120, "Product name should not be more than the 120 characters.."]
    },
    price: {
        type: Number,
        required: [true, "Please provide the product's price.."],
        trim: true,
        maxLength: [5, "Product price shouldn't be more than 5 digits.."]
    },
    description: {
        type: String,
        required: [true, "Please provide the product's description.."],
        trim: true
    },
    photos: [
        {
            id: {
                type: String,
                required: true
            },
            secure_url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please select category from - short-sleeves, long-sleeves, sweat-shirts, hoodies"],
        enum: {
            values: [
                "shortsleeves",
                "longsleeves",
                "sweatshirts",
                "hoodies"
            ],
            message: "Please select category only from - short-sleeves, long-sleeves, sweat-shirts, hoodies"
        },
    },
    brand: {
        type: String,
        required: [true, "Please add a brand for clothing..."]
    },
    ratings: {
        type: Number,
        default: 0
    },
    numberOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Product", productSchema);