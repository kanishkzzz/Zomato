const express = require('express');
const foodController = require('../controllers/food.controller');
const authMiddleWare = require('../middlewares/auth.middleware');
const router = express.Router();
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
});

// POST /api/food [Protected]
router.post('/', authMiddleWare.authFoodPartnerMiddleware, upload.fields([{ name: 'video', maxCount: 1 }]), foodController.createFood);

// GET /api/food/ [protected]
router.get('/', authMiddleWare.authUserMiddleware, foodController.getFoodItems)

router.post('/like', authMiddleWare.authUserMiddleware, foodController.likeFood);

router.post('/save', authMiddleWare.authUserMiddleware, foodController.saveFood);

module.exports = router;