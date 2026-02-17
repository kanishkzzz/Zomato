const foodPartnerModel = require("../models/foodpartner.model");

async function getFoodPartnerById(req, res) {
    try {
        const foodPartnerId = req.params.id;
        const foodPartner = await foodPartnerModel.findById(foodPartnerId);

        if(!foodPartner) {
            return res.status(404).json({ message: "Food Partner not found" });
        }
        res.status(200).json({
            message: "Food Partner found",
            foodPartner
        })
    } catch (err) {
        console.error("Error fetching food partner:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    getFoodPartnerById
}