const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authenticate = require('../middlewares/authMiddleware');

// Route untuk komentar per cerita
router.get('/:storyId', commentController.getCommentsByStoryId);
router.post('/:storyId', authenticate, commentController.createComment);

// Hapus komentar berdasarkan ID
router.delete('/delete/:id', authenticate, commentController.deleteComment);

module.exports = router;
