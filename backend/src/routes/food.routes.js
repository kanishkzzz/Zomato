const express = require('express');
const foodController = require('../controllers/food.controller');
const authMiddleWare = require('../middlewares/auth.middleware');
const router = express.Router();

// POST /api/food [Protected]
router.post('/', authMiddleWare.authFoodPartnerMiddleware, foodController.createFood);

module.exports = router;