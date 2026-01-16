const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');
const { auth, admin } = require('../middlewares/authMiddleware'); // Certifique-se que o path e nomes estão corretos

// ------------------------------------------------------------
// ROTAS DE LIKES (NOVAS)
// ------------------------------------------------------------

// PUT /api/posts/like/:id -> Curte/Descurte um Post
router.put('/like/:id', auth, PostController.likePost);

// PUT /api/posts/comments/like/:id -> Curte/Descurte um Comentário
router.put('/comments/like/:id', auth, PostController.likeComment);

// ------------------------------------------------------------
// ROTAS EXISTENTES
// ------------------------------------------------------------

// GET /api/posts/user/:userId -> Posts do Autor
router.get('/user/:userId', PostController.getPostsByUser);


// GET /api/posts -> Qualquer um pode ver (Agora com filtro de pesquisa)
router.get('/', PostController.getAllPosts);

// POST /api/posts -> Só quem tem Token pode criar
router.post('/', auth, PostController.createPost);

// DELETE /api/posts/:id -> Só ADMIN pode deletar
router.delete('/:id', [auth, admin], PostController.deletePost);

// POST /api/posts/:id/comments -> Comentar em um post específico
router.post('/:id/comments', auth, PostController.addComment);

module.exports = router;