const express = require("express");
const foodController = require("../controllers/food-partner.controller");
const authMiddleWare = require("../middlewares/auth.middleware");

const router = express.Router();

// /api/food-partner/:id
router.get("/food-partner/:id", authMiddleWare.authUserMiddleware, foodController.getFoodPartnerById)
module.exports = router;