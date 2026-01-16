import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

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
        maxWidth: '450px',
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
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '700',
        color: '#0f172a',
        fontSize: '0.85rem',
        textTransform: 'uppercase'
    },
    input: {
        width: '100%',
        padding: '12px',
        boxSizing: 'border-box',
        border: '2px solid #0f172a',
        borderRadius: '12px',
        fontSize: '1em',
        backgroundColor: '#f8fafc',
        outline: 'none',
    },
    adminBox: {
        backgroundColor: '#f1f5f9',
        padding: '15px',
        borderRadius: '12px',
        border: '2px dashed #cbd5e1',
        marginTop: '10px',
        marginBottom: '20px'
    },
    adminLabel: {
        fontSize: '0.75em',
        color: '#64748b',
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '5px',
        textTransform: 'uppercase'
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
        transition: 'all 0.1s',
    },
    linkText: {
        marginTop: '20px',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '0.9rem',
    }
};

function Register() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    adminCode: ''
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função para validar se o e-mail tem um formato real
  const isEmailValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validação de E-mail
    if (!isEmailValid(formData.email)) {
        alert('Por favor, insira um e-mail válido (ex: usuario@dominio.com)');
        return;
    }

    // 2. Validação de Senha (Mínimo 4 caracteres)
    if (formData.senha.length < 4) {
        alert('A senha deve ter no mínimo 4 caracteres.');
        return;
    }

    const role = formData.adminCode === 'admin123' ? 'admin' : 'aluno';

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        role: role
      });
      
      alert('Cadastro realizado com sucesso! Faça login.');
      navigate('/'); 
    } catch (error) {
      alert('Erro ao cadastrar. Verifique se o e-mail já existe ou se há erro no servidor.');
    }
  };

  return (
    <div style={styles.pageWrapper}>
        <div style={styles.container}>
            <h2 style={styles.title}>Feed Acadêmico 💡</h2>
            <p style={styles.subtitle}>Crie sua conta para começar</p>
            
            <form onSubmit={handleSubmit}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Nome Completo</label>
                    <input 
                        name="nome" 
                        type="text" 
                        placeholder="Seu nome" 
                        value={formData.nome}
                        onChange={handleChange} 
                        required 
                        style={styles.input} 
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Email Acadêmico</label>
                    <input 
                        name="email" 
                        type="email" 
                        placeholder="email@exemplo.com" 
                        value={formData.email}
                        onChange={handleChange} 
                        required 
                        style={styles.input} 
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Senha</label>
                    <input 
                        name="senha" 
                        type="password" 
                        placeholder="Mínimo 4 caracteres" 
                        value={formData.senha}
                        onChange={handleChange} 
                        required 
                        minLength="4"
                        style={styles.input} 
                    />
                </div>
                
                <div style={styles.adminBox}>
                    <label style={styles.adminLabel}>Acesso Especial (Opcional)</label>
                    <input 
                        name="adminCode" 
                        type="text" 
                        placeholder="Código de convite" 
                        value={formData.adminCode}
                        onChange={handleChange} 
                        style={{...styles.input, backgroundColor: '#fff', padding: '8px 12px'}} 
                    />
                </div>

                <button 
                    type="submit" 
                    style={styles.button}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'translate(2px, 2px)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'translate(0, 0)'}
                >
                    Criar minha conta
                </button>
            </form>
            <p style={styles.linkText}>
                Já faz parte? <Link to="/" style={{ color: '#0f172a', fontWeight: '900', textDecoration: 'underline' }}>Fazer Login</Link>
            </p>
        </div>
    </div>
  );
}

export default Register;