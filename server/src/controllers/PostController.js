const Post = require('../models/Post');
const Comment = require('../models/Comment'); // Adicione esta linha
// 1. Criar Postagem (Auth Necessária)
exports.createPost = async (req, res) => {
    try {
        const newPost = await Post.create({
            conteudo: req.body.conteudo,
            autor: req.user.id // Pega o ID direto do Token (seguro!)
        });

        res.json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro ao criar post.' });
    }
};

// 2. Listar Postagens (Público ou Auth)
// Substitua o getAllPosts antigo por este:
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('autor', 'nome email')
            .sort({ dataCriacao: -1 })
            .lean(); // lean() permite modificar o JSON resultante

        // Para cada post, busca seus comentários
        for (const post of posts) {
            const comments = await Comment.find({ post: post._id })
                .populate('autor', 'nome')
                .sort({ dataCriacao: 1 });
            post.comments = comments; // Adiciona a lista de comentários no objeto do post
        }

        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro ao buscar posts.' });
    }
};

// 3. Deletar Postagem (Apenas Admin)
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post não encontrado.' });
        }

        await post.deleteOne();
        res.json({ msg: 'Post removido com sucesso!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro ao deletar post.' });
    }
};

// 4. Comentar em um Post
exports.addComment = async (req, res) => {
    try {
        const { texto } = req.body;
        const postId = req.params.id;

        // Cria o comentário linkado ao Post e ao Usuário
        const comment = await Comment.create({
            texto,
            autor: req.user.id,
            post: postId
        });

        res.json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro ao comentar.' });
    }
};