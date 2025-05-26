const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const auth = require('../middlewares/auth');
const multer = require('multer');
const { uploadFile } = require('../utils/storage');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, content, isPublic } = req.body;
    const imageUrl = await uploadFile(req.file);

    const story = await prisma.story.create({
      data: {
        title,
        content,
        isPublic: isPublic === 'true' || isPublic === true,
        imageUrl,
        userId: req.user.id,
      },
    });

    res.json(story);
  } catch (error) {
    res.status(500).json({ message: 'Gagal buat cerita' });
  }
});

// GET all public stories
router.get('/', async (req, res) => {
  try {
    const stories = await prisma.story.findMany({
      where: { isPublic: true },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Gagal ambil cerita' });
  }
});

// GET story by id with comments
router.get('/:id', async (req, res) => {
  try {
    const story = await prisma.story.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        user: true,
        comments: {
          include: { user: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!story) return res.status(404).json({ message: 'Cerita tidak ditemukan' });

    res.json(story);
  } catch (error) {
    res.status(500).json({ message: 'Gagal ambil cerita' });
  }
});

// Update and Delete bisa kamu tambahkan sendiri (opsional)

module.exports = router;
