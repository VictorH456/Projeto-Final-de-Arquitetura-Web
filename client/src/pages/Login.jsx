import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Importamos o contexto

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState(''); // Para feedback visual de erro
  
  const { login } = useContext(AuthContext); // Pegamos a função login do contexto
  const navigate = useNavigate(); // Para mudar de página

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpa erros antigos

    const result = await login(email, senha);

    if (result.success) {
      navigate('/feed'); // Se funcionou, manda para o Feed
    } else {
      setError(result.msg); // Se falhou, mostra o erro na tela
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Entrar na Rede Acadêmica</h2>
      
      {/* Feedback visual de erro (Requisito do projeto) */}
      {error && <p style={{ color: 'red', backgroundColor: '#ffe6e6', padding: '10px' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Senha:</label>
          <input 
            type="password" 
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            required
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          Entrar
        </button>
      </form>
      <p style={{ marginTop: '10px' }}>
        Não tem conta? <Link to="/register">Cadastre-se</Link>
      </p>
    </div>
  );
}

export default Login;