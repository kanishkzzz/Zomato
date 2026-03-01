const foodPartnerModel = require("../models/foodpartner.model");
const foodModel = require("../models/food.model");

async function getFoodPartnerById(req, res) {
    try {
        const foodPartnerId = req.params.id;
        const foodPartner = await foodPartnerModel.findById(foodPartnerId);
        const foodItemsByFoodPartner = await foodModel.find({ foodPartner : foodPartnerId });

        if(!foodPartner) {
            return res.status(404).json({ message: "Food Partner not found" });
        }
        res.status(200).json({
            message: "Food Partner found",
            foodPartner:{
                ...foodPartner.toObject(),
                foodItems: foodItemsByFoodPartner
            }
        })
    } catch (err) {
        console.error("Error fetching food partner:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    getFoodPartnerById
}