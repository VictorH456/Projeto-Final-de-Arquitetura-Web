const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    conteudo: {
        type: String,
        required: true
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Faz referência ao modelo 'User' acima
        required: true
    },
    likes: [{ // Bônus: Array com IDs de quem curtiu (simples)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dataCriacao: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', PostSchema);