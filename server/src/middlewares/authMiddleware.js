const jwt = require('jsonwebtoken');

// Verifica se o usuário tem um token válido
exports.auth = (req, res, next) => {
    // 1. Pega o token do cabeçalho (Header: x-auth-token)
    const token = req.header('x-auth-token');

    // 2. Se não tiver token, barra a entrada
    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado. Token não fornecido.' });
    }

    try {
        // 3. Verifica se o token é válido usando nossa senha secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Se for válido, guarda os dados do usuário na requisição (req.user)
        req.user = decoded;
        next(); // Pode passar para a próxima etapa!
    } catch (error) {
        res.status(400).json({ msg: 'Token inválido.' });
    }
};

// Verifica se o usuário é ADMIN (Requisito obrigatório)
exports.admin = (req, res, next) => {
    // Só funciona se o middleware 'auth' rodou antes
    if (req.user && req.user.role === 'admin') {
        next(); // É admin, pode passar
    } else {
        res.status(403).json({ msg: 'Acesso negado. Apenas Admins podem fazer isso.' });
    }
};