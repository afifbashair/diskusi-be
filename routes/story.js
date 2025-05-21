const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const authenticate = require('../middlewares/authMiddleware');


router.get('/', storyController.getPublicStories);
router.get('/:id', authenticate, storyController.getStoryById);
router.post('/', authenticate, storyController.createStory);
router.put('/:id', authenticate, storyController.updateStory);
router.delete('/:id', authenticate, storyController.deleteStory);



module.exports = router;
