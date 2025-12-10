const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    conteudo: {
        type: String,
        required: true
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    likes: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dataCriacao: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', PostSchema);