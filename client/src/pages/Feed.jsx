import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const styles = {
    container: {
        maxWidth: '750px', // Aumentar um pouco o container
        margin: '0 auto',
        padding: '30px 20px',
        backgroundColor: '#f5f7f9', // Fundo levemente cinza
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '10px 0',
        borderBottom: '1px solid #e0e0e0',
    },
    title: {
        color: '#1e3a8a', // Azul escuro
        fontSize: '1.8em',
        fontWeight: '700',
    },
    userInfo: {
        fontSize: '0.9em',
        color: '#4b5563',
        display: 'flex',
        alignItems: 'center',
    },
    logoutButton: {
        marginLeft: '15px',
        background: '#ef4444', // Vermelho moderno
        color: 'white',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background 0.2s',
    },
    formContainer: {
        marginBottom: '40px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', // Sombra para destaque
    },
    textarea: {
        width: '100%',
        height: '100px',
        marginBottom: '15px',
        padding: '15px',
        boxSizing: 'border-box',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        resize: 'vertical',
        fontSize: '1em',
    },
    postButton: {
        background: '#10b981', // Verde suave para Ação Principal
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        cursor: 'pointer',
        borderRadius: '5px',
        fontWeight: 'bold',
        transition: 'background 0.2s',
        display: 'block',
        marginLeft: 'auto', // Alinhar à direita
    },
    postCard: {
        position: 'relative',
        border: 'none', // Remover borda forte
        padding: '20px',
        marginBottom: '20px',
        borderRadius: '10px',
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', // Sombra sutil para card
    },
    postContent: {
        fontSize: '1.1em',
        margin: '0 0 10px 0',
        color: '#333',
        lineHeight: '1.6',
    },
    postMetadata: {
        color: '#6b7280', // Cinza para info secundária
        fontSize: '0.85em',
        display: 'block',
        marginBottom: '10px',
    },
    deleteButton: {
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'transparent',
        color: '#ef4444',
        border: '1px solid #ef4444',
        padding: '4px 8px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '0.8em',
        fontWeight: 'bold',
        zIndex: 10,
    },
    commentSection: {
        background: '#f9fafb', // Fundo leve para comentários
        padding: '15px',
        borderRadius: '8px',
        marginTop: '15px',
    },
    commentTitle: {
        margin: '0 0 10px 0',
        fontSize: '1em',
        fontWeight: '600',
        color: '#4b5563',
    },
    commentText: {
        fontSize: '0.85em',
        marginBottom: '8px',
        borderBottom: '1px dotted #e5e7eb',
        paddingBottom: '5px',
        lineHeight: '1.4',
    },
    commentForm: {
        marginTop: '10px',
        display: 'flex',
        alignItems: 'center',
    },
    commentInput: {
        flex: 1,
        padding: '8px',
        fontSize: '0.9em',
        border: '1px solid #d1d5db',
        borderRadius: '5px',
    },
    commentSendButton: {
        marginLeft: '8px',
        padding: '8px 15px',
        fontSize: '0.85em',
        background: '#3b82f6', // Azul para Comentário
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '5px',
        fontWeight: 'bold',
        transition: 'background 0.2s',
    }
};

function Feed() {
    const [posts, setPosts] = useState([]);
    const [novoPost, setNovoPost] = useState('');
    const [loading, setLoading] = useState(true);

    const { user, logout } = useContext(AuthContext); 
    const navigate = useNavigate();

    // Função para buscar posts do Backend
    const carregarPosts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/posts');
            setPosts(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar posts:", error);
            setLoading(false);
        }
    };

    // Carrega os posts assim que a tela abre
    useEffect(() => {
        carregarPosts();
    }, []);

    // Função para criar novo post
    const handleCriarPost = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); 

        try {
            await axios.post('http://localhost:5000/api/posts',
                { conteudo: novoPost },
                { headers: { 'x-auth-token': token } } 
            );
            setNovoPost(''); 
            carregarPosts(); 
        } catch (error) {
            alert('Erro ao criar post. Você está logado?');
        }
    };

    // Função para deletar (Só funciona se for Admin)
    const handleDeletar = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir?")) return;

        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/posts/${id}`,
                { headers: { 'x-auth-token': token } }
            );
            carregarPosts(); 
        } catch (error) {
            alert('Erro: Talvez você não tenha permissão de Admin.');
        }
    };

    return (
        <div style={styles.container}>

            {/* Cabeçalho */}
            <header style={styles.header}>
                <h2 style={styles.title}>Feed Acadêmico 💡</h2>
                <div style={styles.userInfo}>
                    <span>Olá, <strong>{user?.nome}</strong> ({user?.role}) </span>
                    <button 
                        onClick={() => { logout(); navigate('/'); }} 
                        style={styles.logoutButton}
                    >
                        Sair
                    </button>
                </div>
            </header>

            {/* Formulário de Novo Post */}
            <form onSubmit={handleCriarPost} style={styles.formContainer}>
                <textarea
                    value={novoPost}
                    onChange={(e) => setNovoPost(e.target.value)}
                    placeholder="Compartilhe sua dúvida, recurso, ou conhecimento com a comunidade..."
                    required
                    style={styles.textarea}
                />
                <button type="submit" style={styles.postButton}>
                    Publicar
                </button>
            </form>

            {/* Lista de Posts */}
            {loading ? (
                <p style={{ textAlign: 'center', color: '#666' }}>Carregando posts...</p>
            ) : (
                posts.map((post) => (
                    <div key={post._id} style={styles.postCard}>
                        {/* Botão Excluir (Admin) */}
                        {user?.role === 'admin' && (
                            <button
                                onClick={() => handleDeletar(post._id)}
                                style={styles.deleteButton}
                            >
                                [X] Excluir
                            </button>
                        )}

                        <p style={styles.postContent}>{post.conteudo}</p>
                        <small style={styles.postMetadata}>
                            Por: **{post.autor?.nome}** em {new Date(post.dataCriacao).toLocaleDateString()}
                        </small>

                        <hr style={{ margin: '15px 0', border: '0', borderTop: '1px solid #f3f4f6' }} />

                        {/* Área de Comentários */}
                        <div style={styles.commentSection}>
                            <h4 style={styles.commentTitle}>Comentários:</h4>

                            {post.comments && post.comments.map(comment => (
                                <div key={comment._id} style={styles.commentText}>
                                    **{comment.autor?.nome}:** {comment.texto}
                                </div>
                            ))}

                            {post.comments?.length === 0 && <p style={{ fontSize: '0.8em', color: '#999' }}>Seja o primeiro a comentar!</p>}

                            {/* Formulário de Comentar */}
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const texto = e.target.elements.comentario.value;
                                    const token = localStorage.getItem('token');
                                    
                                    if (!texto) return;

                                    try {
                                        await axios.post(`http://localhost:5000/api/posts/${post._id}/comments`,
                                            { texto },
                                            { headers: { 'x-auth-token': token } }
                                        );
                                        e.target.reset(); // Limpa o input
                                        carregarPosts(); // Atualiza a tela
                                    } catch (error) {
                                        alert('Erro ao comentar. Verifique seu login.');
                                    }
                                }}
                                style={styles.commentForm}
                            >
                                <input
                                    name="comentario"
                                    type="text"
                                    placeholder="Adicionar um comentário..."
                                    required
                                    style={styles.commentInput}
                                />
                                <button type="submit" style={styles.commentSendButton}>
                                    Enviar
                                </button>
                            </form>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Feed;
