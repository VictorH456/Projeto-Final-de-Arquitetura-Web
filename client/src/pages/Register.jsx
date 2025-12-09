import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

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
    adminLabel: {
        fontSize: '0.8em',
        color: '#6b7280',
        display: 'block',
        marginBottom: '5px',
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#10b981', // Verde para Cadastro (Success)
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
    }
};


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
    <div style={styles.pageWrapper}>
        <div style={styles.container}>
            <h2 style={styles.title}>Criar Conta Acadêmica</h2>
            <form onSubmit={handleSubmit}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Nome:</label>
                    <input name="nome" type="text" onChange={handleChange} required style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Email:</label>
                    <input name="email" type="email" onChange={handleChange} required style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Senha:</label>
                    <input name="senha" type="password" onChange={handleChange} required style={styles.input} />
                </div>
                
                {/* Campo opcional para facilitar testes de Admin */}
                <div style={styles.inputGroup}>
                    <label style={styles.adminLabel}>Código Admin (Opcional):</label>
                    <input name="adminCode" type="text" placeholder="Digite admin123 para ser Admin" onChange={handleChange} style={styles.input} />
                </div>

                <button type="submit" style={styles.button}>
                    Cadastrar
                </button>
            </form>
            <p style={styles.linkText}>
                Já tem conta? <Link to="/" style={{ color: '#3b82f6', fontWeight: 'bold' }}>Fazer Login</Link>
            </p>
        </div>
    </div>
  );
}

export default Register;
