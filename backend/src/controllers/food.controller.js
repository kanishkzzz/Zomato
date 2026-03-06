const foodModel = require('../models/food.model');
const storageService = require('../services/storage.services');
const likeModel = require('../models/likes.model')
const saveModel = require('../models/save.model');
const commentModel = require('../models/comment.model');
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
    try {
        const foodItems = await foodModel.find({}).lean();
        const commentCounts = await commentModel.aggregate([
            {
                $group: {
                    _id: '$reelId',
                    count: { $sum: 1 }
                }
            }
        ]);

        const commentCountByFoodId = new Map(
            commentCounts.map((item) => [String(item._id), item.count])
        );

        const foodItemsWithCounts = foodItems.map((item) => ({
            ...item,
            commentCount: commentCountByFoodId.get(String(item._id)) ?? item.commentCount ?? 0
        }));

        res.status(200).json({
            message: "Food items fetched successfully",
            foodItems: foodItemsWithCounts
        });
    } catch (error) {
        console.error("Error fetching food items:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

async function likeFood(req, res) {
    try {
        const { foodId } = req.body;
        const user = req.user;

        const isAlreadyLiked = await likeModel.findOne({ food: foodId, user: user._id });

        if(isAlreadyLiked) {
            await likeModel.deleteOne({ _id: isAlreadyLiked._id });

            await likeModel.findOneAndUpdate({ _id: foodId }, { $inc: { likeCount: -1 } });

            return res.status(200).json({
                message: "Food item unliked successfully"
            });
        }

        const like = await likeModel.create({
            food: foodId,
            user: user._id
        });
        await foodModel.findOneAndUpdate({ _id: foodId }, { $inc: { likeCount: 1 } });

        res.status(201).json({
            message: "Food item liked successfully",
            like
        });
    } catch (error) {
        console.error("Error liking food item:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

async function saveFood(req, res) {
    try {
        const { foodId } = req.body;
        const user = req.user;

        const isAlreadySaved = await saveModel.findOne({ food: foodId, user: user._id });

        if(isAlreadySaved) {
            await saveModel.deleteOne({ _id: isAlreadySaved._id });

            return res.status(200).json({
                message: "Food item unsaved successfully"
            });
        }

        const save = await saveModel.create({
            food: foodId,
            user: user._id
        });

        res.status(201).json({
            message: "Food item saved successfully",
            save
        });
    } catch (error) {
        console.error("Error saving food item:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

async function getCommentsByFood(req, res) {
    try {
        const { foodId } = req.params;

        const comments = await commentModel
        .find({ reelId: foodId })
        .sort({ createdAt: -1 })
        .limit(100)
        .populate('userId', 'fullName')

        res.status(200).json({
            message: "Comments fetched successfully",
            comments
        })
        
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

async function addComment(req, res) {
    try {
        const {foodId, comment} = req.body;
        const user = req.user;

        if(!foodId || !comment || !comment.trim()) {
            return res.status(400).json({
                message: "Invalid input"
            })
        }

        const foodItem = await foodModel.findById(foodId);
        if(!foodItem) {
            return res.status(404).json({
                message: "Food item not found"
            })
        }

        const createdComment = await commentModel.create({
            reelId: foodId,
            userId: user._id,
            comment: comment.trim()
        })

        await foodModel.findByIdAndUpdate(foodId, { $inc: { commentCount: 1 } })

        const populatedComment = await commentModel
            .findById(createdComment._id)
            .populate('userId', 'fullName')

        res.status(201).json({
            message: "Comment added successfully",
            comment: populatedComment
        }) 
    }catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

async function deleteComment(req, res) {
    try {
        const { commentId } = req.params;
        const user = req.user;

        if(!commentId || !user) {
            return res.status(400).json({
                message: "Invalid input"
            })
        }

        const comment = await commentModel.findById(commentId);

        if(!comment) {
            return res.status(404).json({
                message: "Comment not found"
            })
        }

        await commentModel.deleteOne({ _id: commentId });
        await foodModel.findByIdAndUpdate(comment.reelId, { $inc: { commentCount: -1 } });
        res.status(200).json({
            message: "Comment deleted successfully"
        })
    }catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    deleteComment,
    addComment,
    getCommentsByFood
}
