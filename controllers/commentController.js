const db = require('../db');

// GET komentar untuk 1 cerita
exports.getCommentsByStoryId = async (req, res) => {
  const { storyId } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT comments.id, comments.content, comments.created_at, users.username
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.story_id = ?
      ORDER BY comments.created_at DESC
    `, [storyId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST komentar
exports.createComment = async (req, res) => {
  const { storyId } = req.params;
  const { content } = req.body;
  try {
    await db.query(`
      INSERT INTO comments (user_id, story_id, content)
      VALUES (?, ?, ?)`,
      [req.user.id, storyId, content]
    );
    res.status(201).json({ message: 'Komentar ditambahkan' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE komentar
exports.deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM comments WHERE id = ?', [id]);
    const comment = rows[0];
    if (!comment) return res.status(404).json({ message: 'Komentar tidak ditemukan' });

    if (comment.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Tidak diizinkan menghapus komentar ini' });
    }

    await db.query('DELETE FROM comments WHERE id = ?', [id]);
    res.json({ message: 'Komentar berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
