const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    reelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'food',
        required: true    
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    comment: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

commentSchema.index({ reelId: 1, createdAt: -1 });

const commentModel = mongoose.model('comment', commentSchema);

module.exports = commentModel;
