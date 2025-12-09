import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ao abrir o site, verifica se já tem um login salvo
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Função de Login
  const login = async (email, senha) => {
    try {
      // Chama o Backend
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        senha,
      });

      // Se der certo, salva no navegador e no estado
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      setUser(res.data.user);
      return { success: true };
    } catch (error) {
      // Se der erro, retorna a mensagem do backend
      return { 
        success: false, 
        msg: error.response?.data?.msg || "Erro ao tentar logar." 
      };
    }
  };

  // Função de Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};