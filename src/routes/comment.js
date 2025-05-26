const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const auth = require('../middlewares/auth');

router.post('/', auth, async (req, res) => {
  const { storyId, content } = req.body;
  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        storyId: Number(storyId),
        userId: req.user.id,
      },
    });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Gagal tambah komentar' });
  }
});

module.exports = router;
