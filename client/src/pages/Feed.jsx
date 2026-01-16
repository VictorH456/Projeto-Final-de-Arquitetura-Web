import { useState, useEffect, useContext, useRef } from 'react'; 
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const styles = {
    mainLayout: {
        minHeight: '100vh',
        backgroundColor: '#f1f5f9',
        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        padding: '40px 0',
        fontFamily: '"Inter", sans-serif',
        color: '#0f172a'
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'grid',
        gridTemplateColumns: '300px 1fr 280px',
        gap: '30px',
    },
    header: {
        gridColumn: '1 / -1',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#0f172a',
        padding: '20px 30px',
        borderRadius: '20px',
        marginBottom: '30px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
    },
    brand: {
        fontSize: '1.5rem',
        fontWeight: '900',
        color: '#fbbf24',
        letterSpacing: '-1px'
    },
    headerActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
    },
    userInfo: {
        color: '#fff',
        fontSize: '0.9rem',
        borderRight: '1px solid rgba(255,255,255,0.2)',
        paddingRight: '20px'
    },
    searchInput: {
        flex: 1,
        maxWidth: '400px',
        margin: '0 20px',
        padding: '10px 20px',
        borderRadius: '12px',
        border: 'none',
        backgroundColor: 'rgba(255,255,255,0.1)',
        color: '#fff',
        outline: 'none',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid #0f172a',
        boxShadow: '6px 6px 0px #0f172a',
    },
    postCard: {
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '30px',
        border: '2px solid #0f172a',
        boxShadow: '8px 8px 0px #0f172a',
        transition: 'all 0.2s ease',
        position: 'relative',
    },
    highlightedPost: {
        transform: 'translate(-4px, -4px)',
        boxShadow: '12px 12px 0px #fbbf24',
        borderColor: '#fbbf24',
    },
    titleInput: {
        width: '100%',
        border: 'none',
        fontSize: '1.4rem',
        fontWeight: '900',
        outline: 'none',
        marginBottom: '5px',
        fontFamily: 'inherit',
        color: '#0f172a',
    },
    textarea: {
        width: '100%',
        minHeight: '80px',
        border: 'none',
        fontSize: '1.1rem',
        outline: 'none',
        resize: 'none',
        fontFamily: 'inherit'
    },
    btnPrimary: {
        backgroundColor: '#0f172a',
        color: '#fff',
        border: 'none',
        padding: '12px 25px',
        borderRadius: '10px',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '4px 4px 0px #fbbf24',
    },
    authorBadge: {
        display: 'inline-block',
        backgroundColor: '#f1f5f9',
        padding: '5px 12px',
        borderRadius: '8px',
        fontSize: '0.85rem',
        fontWeight: 'bold',
        color: '#0f172a',
        cursor: 'pointer',
        border: '1px solid #0f172a'
    },
    deleteBtn: {
        position: 'absolute',
        top: '15px',
        right: '15px',
        backgroundColor: '#fee2e2',
        color: '#ef4444',
        border: '1px solid #ef4444',
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '0.7rem',
        fontWeight: 'bold',
        cursor: 'pointer'
    },
    commentBox: {
        marginTop: '20px',
        paddingTop: '20px',
        borderTop: '2px solid #f1f5f9'
    },
    commentItem: {
        backgroundColor: '#f8fafc',
        padding: '12px',
        borderRadius: '12px',
        marginBottom: '10px',
        fontSize: '0.9rem',
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    commentInput: {
        flex: 1,
        padding: '10px',
        borderRadius: '8px',
        border: '2px solid #0f172a',
        marginRight: '10px',
        outline: 'none'
    }
};

function Feed() {
    const [posts, setPosts] = useState([]);
    const [novoTitulo, setNovoTitulo] = useState('');
    const [novoPost, setNovoPost] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [topPosts, setTopPosts] = useState([]); 
    const [selectedAuthorId, setSelectedAuthorId] = useState(null);
    const [authorPosts, setAuthorPosts] = useState([]);
    const [selectedAuthorProfile, setSelectedAuthorProfile] = useState(null); 
    const [highlightedPostId, setHighlightedPostId] = useState(null);
    const postRefs = useRef({});

    const { user, logout } = useContext(AuthContext); 
    const navigate = useNavigate();

    // 1. Função de carregar posts corrigida com encodeURIComponent
    const carregarPosts = async (term = '') => {
        setLoading(true);
        try {
            const query = term ? `?search=${encodeURIComponent(term)}` : '';
            const res = await axios.get(`http://localhost:5000/api/posts${query}`);
            setPosts(res.data);
        } catch (error) {
            console.error("Erro ao buscar posts:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const carregarTopPosts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/posts/top');
            setTopPosts(res.data);
        } catch (error) {}
    };

    // 2. useEffect com Debounce (melhora performance e evita bugs de busca)
    useEffect(() => {
        const timer = setTimeout(() => {
            carregarPosts(searchTerm);
        }, 400); // Espera 400ms após o usuário parar de digitar

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Carrega os top posts apenas uma vez ao montar
    useEffect(() => {
        carregarTopPosts();
    }, []);
    
    const scrollToPost = (postId) => {
        const element = postRefs.current[postId];
        if (element) {
            setHighlightedPostId(postId); 
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => setHighlightedPostId(null), 3000);
        }
    };

    const handleViewAuthorPosts = async (authorId, authorName, authorRole) => {
        if (selectedAuthorId === authorId) {
            setSelectedAuthorId(null); setSelectedAuthorProfile(null); setAuthorPosts([]); return;
        }
        setSelectedAuthorId(authorId);
        setSelectedAuthorProfile({ name: authorName, role: authorRole || 'Usuário' }); 
        try {
            const res = await axios.get(`http://localhost:5000/api/posts/user/${authorId}`);
            setAuthorPosts(res.data);
        } catch (error) {}
    };

    const handleCriarPost = async (e) => {
        e.preventDefault();
        if (!novoTitulo.trim() || !novoPost.trim()) return alert("Preencha título e conteúdo!");
        
        const conteudoFinal = `${novoTitulo.trim()}|||${novoPost.trim()}`;

        try {
            await axios.post('http://localhost:5000/api/posts', 
                { conteudo: conteudoFinal }, 
                { headers: { 'x-auth-token': localStorage.getItem('token') } }
            );
            setNovoPost(''); 
            setNovoTitulo('');
            carregarPosts(searchTerm); 
            carregarTopPosts(); 
        } catch (error) { alert('Erro ao postar'); }
    };

    const handleDeletar = async (id) => {
        if (!window.confirm("Excluir post permanentemente?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/posts/${id}`, { headers: { 'x-auth-token': localStorage.getItem('token') } });
            carregarPosts(searchTerm); carregarTopPosts();
        } catch (error) { alert('Erro ao deletar'); }
    };

    const handleLikePost = async (postId) => {
        try {
            await axios.put(`http://localhost:5000/api/posts/like/${postId}`, {}, { headers: { 'x-auth-token': localStorage.getItem('token') } });
            carregarPosts(searchTerm); carregarTopPosts(); 
        } catch (error) {}
    };

    const handleComentar = async (e, postId) => {
        e.preventDefault();
        const texto = e.target.elements.comentario.value;
        if (!texto) return;
        try {
            await axios.post(`http://localhost:5000/api/posts/${postId}/comments`, { texto }, { headers: { 'x-auth-token': localStorage.getItem('token') } });
            e.target.reset(); carregarPosts(searchTerm); 
        } catch (error) {}
    };

    const handleLikeComment = async (commentId) => {
        try {
            await axios.put(`http://localhost:5000/api/posts/comments/like/${commentId}`, {}, { headers: { 'x-auth-token': localStorage.getItem('token') } });
            carregarPosts(searchTerm); 
        } catch (error) {}
    };

    const formatarPost = (texto) => {
        if (texto && texto.includes('|||')) {
            const partes = texto.split('|||');
            return { titulo: partes[0], corpo: partes[1] };
        }
        return { titulo: null, corpo: texto || '' };
    };

    return (
        <div style={styles.mainLayout}>
            <div style={styles.container}>
                
                <header style={styles.header}>
                    <div style={styles.brand}>FEED ACADÊMICO 💡</div>
                    <input 
                        style={styles.searchInput} 
                        placeholder="Pesquisar conhecimentos..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div style={styles.headerActions}>
                        <div style={styles.userInfo}>
                            <strong>{user?.nome}</strong> ({user?.role})
                        </div>
                        <button onClick={() => { logout(); navigate('/'); }} style={{background: '#fbbf24', border: '2px solid #0f172a', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'}}>Sair</button>
                    </div>
                </header>

                <aside>
                    <div style={styles.card}>
                        <div style={{width: '60px', height: '60px', backgroundColor: '#0f172a', borderRadius: '15px', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#fbbf24', fontWeight: '900', border: '2px solid #fbbf24'}}>
                            {selectedAuthorProfile ? selectedAuthorProfile.name?.[0] : (user?.nome ? user.nome[0] : '?')}
                        </div>
                        <h3 style={{margin: '0'}}>{selectedAuthorProfile?.name || user?.nome}</h3>
                        <p style={{color: '#64748b', fontSize: '0.8rem', marginBottom: '15px'}}>{selectedAuthorProfile?.role || user?.role}</p>
                        <h4 style={{fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px'}}>Posts do Autor</h4>
                        {authorPosts.map(p => {
                            const { titulo, corpo } = formatarPost(p.conteudo);
                            return (
                                <div key={p._id} onClick={() => scrollToPost(p._id)} style={{padding: '8px 0', cursor: 'pointer', fontSize: '0.8rem', borderBottom: '1px solid #f1f5f9'}}>
                                    <strong>{titulo || corpo.substring(0, 20)}</strong>
                                </div>
                            );
                        })}
                    </div>
                </aside>

                <main>
                    <div style={styles.postCard}>
                        <form onSubmit={handleCriarPost}>
                            <input 
                                style={styles.titleInput}
                                placeholder="Título do post..."
                                value={novoTitulo}
                                onChange={(e) => setNovoTitulo(e.target.value)}
                            />
                            <textarea 
                                style={styles.textarea} 
                                placeholder="Escreva o conteúdo aqui..." 
                                value={novoPost}
                                onChange={(e) => setNovoPost(e.target.value)}
                            />
                            <div style={{textAlign: 'right', borderTop: '1px solid #f1f5f9', paddingTop: '15px'}}>
                                <button type="submit" style={styles.btnPrimary}>Publicar</button>
                            </div>
                        </form>
                    </div>

                    {loading ? <p>Carregando posts...</p> : posts.map(post => {
                        const { titulo, corpo } = formatarPost(post.conteudo);
                        return (
                            <div 
                                key={post._id} 
                                ref={el => postRefs.current[post._id] = el}
                                style={{...styles.postCard, ...(highlightedPostId === post._id ? styles.highlightedPost : {})}}
                            >
                                {user?.role === 'admin' && <button onClick={() => handleDeletar(post._id)} style={styles.deleteBtn}>Excluir</button>}
                                
                                {titulo && <h2 style={{fontSize: '1.4rem', fontWeight: '900', marginBottom: '10px', color: '#0f172a'}}>{titulo}</h2>}
                                
                                <p style={{fontSize: '1.1rem', marginBottom: '20px', lineHeight: '1.5'}}>{corpo}</p>
                                
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <span style={styles.authorBadge} onClick={() => handleViewAuthorPosts(post.autor?._id, post.autor?.nome, post.autor?.role)}>
                                        @{post.autor?.nome}
                                    </span>
                                    <button onClick={() => handleLikePost(post._id)} style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem'}}>
                                        {post.likes?.includes(user?.id) ? '❤️' : '🤍'} {post.likes?.length || 0}
                                    </button>
                                </div>

                                <div style={styles.commentBox}>
                                    {post.comments?.map(c => (
                                        <div key={c._id} style={styles.commentItem}>
                                            <span><strong>{c.autor?.nome}:</strong> {c.texto}</span>
                                            <button onClick={() => handleLikeComment(c._id)} style={{border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem'}}>
                                                👍 {c.likes?.length || 0}
                                            </button>
                                        </div>
                                    ))}
                                    <form onSubmit={(e) => handleComentar(e, post._id)} style={{display: 'flex', marginTop: '15px'}}>
                                        <input name="comentario" placeholder="Adicionar comentário..." style={styles.commentInput} />
                                        <button type="submit" style={{...styles.btnPrimary, padding: '8px 15px'}}>Enviar</button>
                                    </form>
                                </div>
                            </div>
                        );
                    })}
                </main>

                <aside>
                    <div style={styles.card}>
                        <h3 style={{fontSize: '1rem', marginBottom: '20px'}}>Em Alta 🔥</h3>
                        {topPosts.map((post, i) => {
                            const { titulo, corpo } = formatarPost(post.conteudo);
                            return (
                                <div key={post._id} onClick={() => scrollToPost(post._id)} style={{display: 'flex', gap: '10px', marginBottom: '15px', cursor: 'pointer'}}>
                                    <span style={{fontSize: '1.5rem', fontWeight: '900', color: '#e2e8f0'}}>{i+1}</span>
                                    <div style={{fontSize: '0.8rem', fontWeight: '500'}}>
                                        <strong>{titulo || corpo.substring(0, 20)}</strong>
                                        <div style={{color: '#94a3b8', fontSize: '0.7rem'}}>❤️ {post.likes?.length} curtidas</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </aside>

            </div>
        </div>
    );
}

export default Feed;