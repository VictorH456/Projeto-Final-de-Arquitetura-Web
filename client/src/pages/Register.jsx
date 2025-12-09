import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    adminCode: '' // Truque para criar admin via front (só para testes escolares)
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Define o papel baseado no código secreto (apenas para facilitar seus testes)
    const role = formData.adminCode === 'admin123' ? 'admin' : 'aluno';

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        role: role
      });
      
      alert('Cadastro realizado com sucesso! Faça login.');
      navigate('/'); // Manda o usuário para a tela de login
    } catch (error) {
      alert('Erro ao cadastrar. Verifique se o email já existe.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Criar Conta</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Nome:</label>
          <input name="nome" type="text" onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label>
          <input name="email" type="email" onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Senha:</label>
          <input name="senha" type="password" onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        
        {/* Campo opcional para facilitar testes de Admin */}
        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontSize: '0.8em', color: '#666' }}>Código Admin (Opcional):</label>
          <input name="adminCode" type="text" placeholder="Digite admin123 para ser Admin" onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
          Cadastrar
        </button>
      </form>
      <p style={{ marginTop: '10px' }}>
        Já tem conta? <Link to="/">Fazer Login</Link>
      </p>
    </div>
  );
}

export default Register;