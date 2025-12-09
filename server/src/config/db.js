const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Tenta conectar usando a URL que definimos no .env
        await mongoose.connect(process.env.MONGO_URI);
        
        console.log('MongoDB Conectado com Sucesso!');
    } catch (error) {
        console.error('Erro ao conectar no MongoDB:', error.message);
        process.exit(1); // Encerra o processo se falhar
    }
};

module.exports = connectDB;