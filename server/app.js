const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db.js');
const authRoutes = require('./src/routes/authRoutes');
const postRoutes = require('./src/routes/postRoutes');

// 1. Carregar variáveis de ambiente
dotenv.config();

// 2. Conectar ao Banco de Dados
connectDB();

// 3. Iniciar o App Express
const app = express();

// 4. Middlewares (Configurações básicas)
app.use(express.json()); // Permite que o servidor entenda JSON (importante para API)
app.use(cors()); // Permite que o Frontend acesse este servidor
// Rotas da API
app.use('/api/auth', authRoutes);
// 5. Rota de Teste (Só para ver se funciona)
app.use('/api/posts', postRoutes);
app.get('/', (req, res) => {
    res.send('API da Rede Social Acadêmica está rodando!');
});

// 6. Subir o Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});