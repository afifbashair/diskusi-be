const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));

const storyRoutes = require('./routes/story');
app.use('/api/stories', storyRoutes);

const commentRoutes = require('./routes/comment');
app.use('/api/comments', commentRoutes);

const likeRoutes = require('./routes/like');
app.use('/api/likes', likeRoutes);

