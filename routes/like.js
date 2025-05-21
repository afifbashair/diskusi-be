const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const authenticate = require('../middlewares/authMiddleware');

// Get jumlah like untuk cerita tertentu
router.get('/:storyId', likeController.getLikesCount);

// Toggle like (harus login)
router.post('/:storyId/toggle', authenticate, likeController.toggleLike);

module.exports = router;
