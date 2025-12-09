const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Não permite dois usuários com mesmo email
        lowercase: true
    },
    senha: {
        type: String,
        required: true, // Aqui guardaremos o HASH, não a senha pura
        select: false   // Por segurança, não traz a senha nas buscas normais
    },
    role: {
        type: String,
        enum: ['aluno', 'admin'], // Só aceita esses dois valores
        default: 'aluno'
    },
    dataCriacao: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);