import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 

const styles = {
    pageWrapper: {
        backgroundColor: '#f5f7f9', 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif'
    },
    container: {
        padding: '30px',
        maxWidth: '450px', 
        width: '90%',
        backgroundColor: 'white',
        border: 'none',
        borderRadius: '12px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)', 
    },
    title: {
        textAlign: 'center',
        marginBottom: '25px',
        color: '#1e3a8a', 
        fontSize: '2em',
    },
    inputGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: '500',
        color: '#374151',
    },
    input: {
        width: '100%',
        padding: '12px',
        boxSizing: 'border-box',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '1em',
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#3b82f6', // Azul primário
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1.1em',
        fontWeight: 'bold',
        transition: 'background 0.2s',
    },
    linkText: {
        marginTop: '15px',
        textAlign: 'center',
        color: '#6b7280',
    },
    errorBox: {
        color: '#991b1b',
        backgroundColor: '#fee2e2',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center',
        border: '1px solid #fca5a5',
        fontSize: '0.95em',
    }
};

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState(''); 
  
  const { login } = useContext(AuthContext); 
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    const result = await login(email, senha);

    if (result.success) {
      navigate('/feed'); 
    } else {
      setError(result.msg); 
    }
  };

  return (
    <div style={styles.pageWrapper}>
        <div style={styles.container}>
            <h2 style={styles.title}>Entrar na Rede Acadêmica</h2>
            
            {/* Feedback visual de erro (Requisito do projeto) */}
            {error && <p style={styles.errorBox}>**Erro:** {error}</p>}

            <form onSubmit={handleSubmit}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Email:</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Senha:</label>
                    <input 
                        type="password" 
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <button type="submit" style={styles.button}>
                    Entrar
                </button>
            </form>
            <p style={styles.linkText}>
                Não tem conta? <Link to="/register" style={{ color: '#3b82f6', fontWeight: 'bold' }}>Cadastre-se</Link>
            </p>
        </div>
    </div>
  );
}

export default Login;
