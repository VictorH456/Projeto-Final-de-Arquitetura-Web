const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    texto: {
        type: String,
        required: true
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', // Liga o comentário ao Post específico
        required: true
    },
    // --- NOVO: Campo necessário para a função de curtir comentários ---
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // ------------------------------------------------------------------
    dataCriacao: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comment', CommentSchema);