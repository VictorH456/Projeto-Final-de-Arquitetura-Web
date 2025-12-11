const Post = require('../models/Post');
const Comment = require('../models/Comment');

// 1. Criar Postagem
exports.createPost = async (req, res) => {
    try {
        const newPost = await Post.create({
            conteudo: req.body.conteudo,
            autor: req.user.id
        });
        res.json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro ao criar post.' });
    }
};

// 2. Listar Postagens
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('autor', 'nome email')
            .sort({ dataCriacao: -1 })
            .lean();

        for (const post of posts) {
            const comments = await Comment.find({ post: post._id })
                .populate('autor', 'nome')
                .sort({ dataCriacao: 1 });
            post.comments = comments;
        }

        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro ao buscar posts.' });
    }
};

// 3. Deletar Postagem
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'Post não encontrado.' });

        await post.deleteOne();
        res.json({ msg: 'Post removido com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro ao deletar post.' });
    }
};

// 4. Comentar
exports.addComment = async (req, res) => {
    try {
        const { texto } = req.body;
        const comment = await Comment.create({
            texto,
            autor: req.user.id,
            post: req.params.id
        });
        res.json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro ao comentar.' });
    }
};

// 5. Atualizar Post (A função que estava faltando!)
exports.updatePost = async (req, res) => {
    try {
        const { conteudo } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ msg: 'Post não encontrado' });

        if (post.autor.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Não autorizado' });
        }

        post.conteudo = conteudo;
        await post.save();
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro ao atualizar post' });
    }
};
// ... (mantenha o código anterior aqui)

// 6. Curtir/Descurtir Post
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'Post não encontrado' });

        // Verifica se já curtiu
        if (post.likes.includes(req.user.id)) {
            // Se já curtiu, remove o like (Pull)
            post.likes.pull(req.user.id);
        } else {
            // Se não curtiu, adiciona o like (Push)
            post.likes.push(req.user.id);
        }

        await post.save();
        res.json(post.likes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro ao curtir post' });
    }
};

// 7. Curtir/Descurtir Comentário
exports.likeComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ msg: 'Comentário não encontrado' });

        if (comment.likes.includes(req.user.id)) {
            comment.likes.pull(req.user.id);
        } else {
            comment.likes.push(req.user.id);
        }

        await comment.save();
        res.json(comment.likes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro ao curtir comentário' });
    }
};

// 8. Buscar posts de um usuário específico
exports.getPostsByUser = async (req, res) => {
    try {
        const posts = await Post.find({ autor: req.params.userId })
            .populate('autor', 'nome email')
            .sort({ dataCriacao: -1 })
            .lean();

        // Popula comentários também
        for (const post of posts) {
            const comments = await Comment.find({ post: post._id })
                .populate('autor', 'nome')
                .sort({ dataCriacao: 1 });
            post.comments = comments;
        }

        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro ao buscar posts do usuário' });
    }
};