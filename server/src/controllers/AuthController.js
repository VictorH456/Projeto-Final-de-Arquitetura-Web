const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Função para registrar um novo usuário
exports.register = async (req, res) => {
    const { nome, email, senha, role } = req.body;

    try {
        // 1. Verifica se o usuário já existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ msg: 'Este email já está em uso.' });
        }

        // 2. Cria o Hash da senha (Segurança Obrigatória)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);

        // 3. Cria o usuário no banco
        const user = await User.create({
            nome,
            email,
            senha: hashedPassword,
            role: role || 'aluno' // Se não enviar nada, é aluno por padrão
        });

        res.status(201).json({ msg: 'Usuário criado com sucesso!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro no servidor ao registrar.' });
    }
};

// Função para fazer Login
exports.login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // 1. Procura o usuário e pede para trazer a senha (que estava escondida no Model)
        const user = await User.findOne({ email }).select('+senha');
        
        if (!user) {
            return res.status(400).json({ msg: 'Credenciais inválidas.' });
        }

        // 2. Compara a senha digitada com o Hash do banco
        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciais inválidas.' });
        }

        // 3. Gera o Token (O "crachá" do usuário)
        const payload = {
            id: user._id,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h' // Token expira em 1 hora
        });

        // 4. Retorna o token e dados do usuário (sem a senha)
        res.json({
            token,
            user: {
                id: user._id,
                nome: user.nome,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro no servidor ao logar.' });
    }
};