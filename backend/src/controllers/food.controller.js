const foodModel = require('../models/food.model');
const storageService = require('../services/storage.services');
const {v4: uuid} = require('uuid');


async function createFood(req, res) {
    try {
        // Check if file was uploaded
        if (!req.files || !req.files.video || req.files.video.length === 0) {
            return res.status(400).json({
                message: "No video file uploaded. Please upload a file."
            });
        }

        // Check if foodPartner exists in request
        if (!req.foodPartner || !req.foodPartner._id) {
            return res.status(401).json({
                message: "Food Partner not authenticated"
            });
        }

        // Validate required fields
        if (!req.body.name || !req.body.description) {
            return res.status(400).json({
                message: "Name and description are required"
            });
        }

        const fileUploadResult = await storageService.uploadFile(req.files.video[0].buffer, uuid());

        const foodItem = await foodModel.create({
            name: req.body.name,
            description: req.body.description,
            video : fileUploadResult.url,
            foodPartner: req.foodPartner._id
        })

        res.status(201).json({
            message: "Food item created successfully",
            foodItem: foodItem
        })
    } catch (error) {
        console.error('Error creating food item:', error);
        res.status(500).json({
            message: "Error creating food item",
            error: error.message
        })
    }
}

async function getFoodItems(req, res) {
    const foodItems = await foodModel.find({})

    res.status(200).json({
        message: "Food items fetched successfully",
        foodItems
    })
}
module.exports = {
    createFood,
    getFoodItems
}