const db = require('../db');

// Dapatkan jumlah like sebuah cerita
exports.getLikesCount = async (req, res) => {
  const { storyId } = req.params;
  try {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM likes WHERE story_id = ?', [storyId]);
    res.json({ likes: rows[0].count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// User like sebuah cerita (toggle: jika sudah like hapus, jika belum like tambah)
exports.toggleLike = async (req, res) => {
  const { storyId } = req.params;
  const userId = req.user.id;

  try {
    // Cek apakah user sudah like cerita ini
    const [existingLike] = await db.query('SELECT * FROM likes WHERE story_id = ? AND user_id = ?', [storyId, userId]);

    if (existingLike.length > 0) {
      // Jika sudah like, hapus like (unlike)
      await db.query('DELETE FROM likes WHERE story_id = ? AND user_id = ?', [storyId, userId]);
      return res.json({ message: 'Like dihapus' });
    } else {
      // Jika belum like, tambah like
      await db.query('INSERT INTO likes (story_id, user_id) VALUES (?, ?)', [storyId, userId]);
      return res.json({ message: 'Like ditambahkan' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
