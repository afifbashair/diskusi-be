const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const storyRoutes = require('./routes/stories');
const commentRoutes = require('./routes/comments');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/stories', storyRoutes);
app.use('/comments', commentRoutes);

app.get('/', (req, res) => {
  res.send('API Ceritaku running');
});

module.exports = app;
