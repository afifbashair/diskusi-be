const db = require('../db');

// GET semua cerita publik
exports.getPublicStories = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT stories.*, users.username 
      FROM stories JOIN users ON stories.user_id = users.id
      WHERE visibility = 'public'
      ORDER BY stories.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET detail cerita tertentu
exports.getStoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM stories WHERE id = ?', [id]);
    const story = rows[0];
    if (!story) return res.status(404).json({ message: 'Cerita tidak ditemukan' });

    if (story.visibility === 'private' && req.user?.id !== story.user_id) {
      return res.status(403).json({ message: 'Tidak diizinkan mengakses cerita ini' });
    }

    res.json(story);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST buat cerita
exports.createStory = async (req, res) => {
  const { title, content, topic, visibility } = req.body;
  try {
    await db.query(`
      INSERT INTO stories (user_id, title, content, topic, visibility)
      VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, title, content, topic, visibility]
    );
    res.status(201).json({ message: 'Cerita berhasil dibuat' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT edit cerita
exports.updateStory = async (req, res) => {
  const { id } = req.params;
  const { title, content, topic, visibility } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM stories WHERE id = ?', [id]);
    const story = rows[0];
    if (!story) return res.status(404).json({ message: 'Cerita tidak ditemukan' });

    if (story.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Tidak diizinkan mengedit cerita ini' });
    }

    await db.query(`
      UPDATE stories
      SET title = ?, content = ?, topic = ?, visibility = ?
      WHERE id = ?`,
      [title, content, topic, visibility, id]
    );
    res.json({ message: 'Cerita berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE hapus cerita
exports.deleteStory = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM stories WHERE id = ?', [id]);
    const story = rows[0];
    if (!story) return res.status(404).json({ message: 'Cerita tidak ditemukan' });

    if (story.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Tidak diizinkan menghapus cerita ini' });
    }

    await db.query('DELETE FROM stories WHERE id = ?', [id]);
    res.json({ message: 'Cerita berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
