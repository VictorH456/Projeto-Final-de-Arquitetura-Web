const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');
const { auth, admin } = require('../middlewares/authMiddleware');

// GET /api/posts -> Qualquer um pode ver
router.get('/', PostController.getAllPosts);

// POST /api/posts -> Só quem tem Token pode criar
router.post('/', auth, PostController.createPost);

// DELETE /api/posts/:id -> Só ADMIN pode deletar
router.delete('/:id', [auth, admin], PostController.deletePost);
// POST /api/posts/:id/comments -> Comentar em um post específico
router.post('/:id/comments', auth, PostController.addComment);

module.exports = router;