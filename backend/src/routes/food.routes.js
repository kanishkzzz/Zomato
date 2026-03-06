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

//Comment routes
router.get('/:foodId/comments', authMiddleWare.authUserMiddleware, foodController.getCommentsByFood);
router.post('/comment', authMiddleWare.authUserMiddleware, foodController.addComment);
router.delete('/comment/:commentId', authMiddleWare.authUserMiddleware, foodController.deleteComment);

module.exports = router;