import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 

const styles = {
    pageWrapper: {
        backgroundColor: '#f1f5f9', 
        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        fontFamily: '"Inter", sans-serif'
    },
    container: {
        padding: '40px',
        maxWidth: '400px', 
        width: '90%',
        backgroundColor: 'white',
        border: '2px solid #0f172a',
        borderRadius: '20px',
        boxShadow: '12px 12px 0px #0f172a',
    },
    title: {
        textAlign: 'center',
        marginBottom: '10px',
        color: '#0f172a', 
        fontSize: '1.8em',
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: '-1px'
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: '30px',
        color: '#64748b',
        fontSize: '0.9em',
    },
    inputGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '700',
        color: '#0f172a',
        fontSize: '0.9rem',
        textTransform: 'uppercase'
    },
    input: {
        width: '100%',
        padding: '14px',
        boxSizing: 'border-box',
        border: '2px solid #0f172a',
        borderRadius: '12px',
        fontSize: '1em',
        backgroundColor: '#f8fafc',
        outline: 'none',
        transition: 'all 0.2s',
    },
    button: {
        width: '100%',
        padding: '14px',
        backgroundColor: '#0f172a', 
        color: '#fbbf24', 
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '1.1em',
        fontWeight: '900',
        textTransform: 'uppercase',
        boxShadow: '4px 4px 0px #fbbf24',
        marginTop: '10px',
        transition: 'transform 0.1s',
    },
    linkText: {
        marginTop: '25px',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '0.9rem',
    },
    errorBox: {
        color: '#fff',
        backgroundColor: '#ef4444',
        padding: '12px',
        borderRadius: '10px',
        marginBottom: '20px',
        textAlign: 'center',
        border: '2px solid #0f172a',
        fontWeight: 'bold',
        fontSize: '0.9em',
        boxShadow: '4px 4px 0px #0f172a'
    }
};

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState(''); 
  
  const { login } = useContext(AuthContext); 
  const navigate = useNavigate(); 

  // Função para validar formato de e-mail real
  const isEmailValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    // 1. Validação de E-mail
    if (!isEmailValid(email)) {
        setError('Por favor, insira um e-mail válido.');
        return;
    }

    // 2. Validação de Senha (Mínimo 4 caracteres)
    if (senha.length < 4) {
        setError('A senha deve conter pelo menos 4 caracteres.');
        return;
    }

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
            <h2 style={styles.title}>Feed Acadêmico 💡</h2>
            <p style={styles.subtitle}>Entre para compartilhar conhecimento</p>
            
            {error && (
                <div style={styles.errorBox}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Email</label>
                    <input 
                        type="email" 
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Senha</label>
                    <input 
                        type="password" 
                        placeholder="Mínimo 4 caracteres"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        style={styles.input}
                        required
                        minLength="4" 
                    />
                </div>
                <button 
                    type="submit" 
                    style={styles.button}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'translate(2px, 2px)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'translate(0, 0)'}
                >
                    Entrar na Conta
                </button>
            </form>
            <p style={styles.linkText}>
                Novo por aqui? <Link to="/register" style={{ color: '#0f172a', fontWeight: '900', textDecoration: 'underline' }}>Crie sua conta</Link>
            </p>
        </div>
    </div>
  );
}

export default Login;