import { useState, useEffect, useContext, useRef } from 'react'; 
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const styles = {
    // Estilos para o layout principal
    mainLayout: {
        maxWidth: '1300px', 
        margin: '0 auto',
        padding: '30px 20px',
        backgroundColor: '#f5f7f9',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif'
    },
    
    // Header do Topo (Título, Usuário Logado e Barra de Busca)
    topHeader: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '10px 0 20px 0',
        borderBottom: '1px solid #e0e0e0',
    },
    title: {
        color: '#1e3a8a',
        fontSize: '2.2em', 
        fontWeight: '700',
    },
    headerRow: { // Para alinhar o título e o perfil logado
        display: 'flex', 
        justifyContent: 'space-between', 
        width: '100%', 
        maxWidth: '1000px', 
        marginBottom: '15px' 
    },
    userInfo: {
        fontSize: '0.9em',
        color: '#4b5563',
        display: 'flex',
        alignItems: 'center',
    },
    logoutButton: {
        background: '#ef4444', 
        color: 'white',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginLeft: '15px',
    },
    searchContainer: {
        width: '80%', 
        maxWidth: '700px',
        margin: '0 auto',
    },
    searchInput: {
        width: '100%',
        padding: '12px 20px',
        borderRadius: '25px',
        border: '1px solid #c8d3e2',
        fontSize: '1em',
        boxSizing: 'border-box',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    },

    // Container das Colunas (Abaixo do Header)
    columnContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },

    // 1. BARRA LATERAL ESQUERDA (Perfil do Autor Clicado e seus Posts)
    leftSidebar: {
        flex: '0 0 300px', 
        marginRight: '30px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        alignSelf: 'flex-start',
        position: 'sticky', 
        top: '30px', 
        height: 'fit-content',
    },
    authorProfileCard: { // NOVO ESTILO: Perfil do autor clicado
        textAlign: 'center',
        marginBottom: '25px',
        paddingBottom: '15px',
        borderBottom: '1px solid #e0e0e0',
    },
    authorNameDisplay: {
        fontSize: '1.2em',
        fontWeight: 'bold',
        color: '#1e3a8a',
        marginTop: '10px',
    },
    authorRoleDisplay: {
        fontSize: '0.9em',
        color: '#6b7280',
    },
    authorPostCard: {
        padding: '12px',
        marginBottom: '10px',
        borderRadius: '6px',
        backgroundColor: '#f0f9ff',
        borderLeft: '4px solid #3b82f6',
        fontSize: '0.9em',
        cursor: 'pointer',
    },

    // 2. CONTEÚDO PRINCIPAL (Feed)
    feedContent: {
        flex: 1, 
        minWidth: '550px', 
    },

    // 3. BARRA LATERAL DIREITA (Top Posts Mais Curtidos)
    rightSidebar: {
        flex: '0 0 300px', 
        marginLeft: '30px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        alignSelf: 'flex-start',
        position: 'sticky', 
        top: '30px', 
        height: 'fit-content',
    },
    topPostCard: {
        padding: '10px 0',
        borderBottom: '1px dotted #e0e0e0',
        marginBottom: '10px',
        cursor: 'pointer',
    },
    topPostTitle: {
        fontSize: '0.95em',
        fontWeight: '500',
        color: '#333',
        margin: '0',
    },
    topPostLikes: {
        fontSize: '0.8em',
        color: '#ef4444', 
        fontWeight: 'bold',
        marginTop: '3px',
    },

    // Estilos de Posts no Feed (mantidos)
    postCard: {
        position: 'relative',
        border: 'none',
        padding: '20px',
        marginBottom: '20px',
        borderRadius: '10px',
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease-in-out', 
    },
    highlightedPost: {
        backgroundColor: '#fffbeb', 
        border: '3px solid #f97316', 
        transform: 'scale(1.01)',
    },
    // ... outros estilos de post, like, comment (mantidos)
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
        background: '#10b981',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        cursor: 'pointer',
        borderRadius: '5px',
        fontWeight: 'bold',
        transition: 'background 0.2s',
        display: 'block',
        marginLeft: 'auto',
    },
    commentForm: {
        display: 'flex',
        marginTop: '10px',
    },
    commentInput: {
        flex: 1,
        padding: '8px',
        borderRadius: '5px 0 0 5px',
        border: '1px solid #d1d5db',
        borderRight: 'none',
    },
    commentSendButton: {
        background: '#3b82f6',
        color: 'white',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '0 5px 5px 0',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
};

function Feed() {
    const [posts, setPosts] = useState([]);
    const [novoPost, setNovoPost] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // ESTADOS PARA AS SIDEBARS
    const [topPosts, setTopPosts] = useState([]); 
    const [selectedAuthorId, setSelectedAuthorId] = useState(null);
    const [authorPosts, setAuthorPosts] = useState([]);

    // NOVO ESTADO: Armazena o perfil do autor CLICADO
    const [selectedAuthorProfile, setSelectedAuthorProfile] = useState(null); 

    const [highlightedPostId, setHighlightedPostId] = useState(null);
    const postRefs = useRef({});

    const { user, logout } = useContext(AuthContext); 
    const navigate = useNavigate();

    // ------------------------------------------------------------------
    // FUNÇÕES DE DADOS E CARREGAMENTO
    // ------------------------------------------------------------------

    const carregarPosts = async (term = '') => {
        setLoading(true);
        try {
            const url = `http://localhost:5000/api/posts${term ? `?search=${term}` : ''}`;
            const res = await axios.get(url);
            setPosts(res.data);
            setLoading(false);
            setHighlightedPostId(null); 
        } catch (error) {
            console.error("Erro ao buscar posts:", error);
            setLoading(false);
        }
    };
    
    const carregarTopPosts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/posts/top');
            setTopPosts(res.data);
        } catch (error) {
            console.error("Erro ao buscar top posts:", error);
        }
    };

    // Efeito para carregar dados iniciais (Posts e Top Posts)
    useEffect(() => {
        carregarPosts(searchTerm);
        carregarTopPosts();
    }, [searchTerm]); 
    
    // Função para rolar até o post e destacá-lo
    const scrollToPost = (postId) => {
        const element = postRefs.current[postId];

        if (element) {
            setHighlightedPostId(postId); 
            element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });

            setTimeout(() => {
                setHighlightedPostId(null);
            }, 3000);
        } else {
             alert("O post original não está visível no feed atual (pode ter sido filtrado).");
        }
    };


    // Função para carregar posts de um usuário específico e ATUALIZAR O PERFIL NA SIDEBAR
    const handleViewAuthorPosts = async (authorId, authorName, authorRole) => {
        // Se clicar no mesmo autor, desativa a visualização
        if (selectedAuthorId === authorId) {
            setSelectedAuthorId(null);
            setSelectedAuthorProfile(null);
            setAuthorPosts([]);
            return;
        }

        setSelectedAuthorId(authorId);
        // NOVO: Define o perfil do autor clicado
        setSelectedAuthorProfile({ name: authorName, role: authorRole || 'Usuário' }); 
        setAuthorPosts([]); // Limpa enquanto carrega

        try {
            const res = await axios.get(`http://localhost:5000/api/posts/user/${authorId}`);
            setAuthorPosts(res.data);
        } catch (error) {
            console.error("Erro ao buscar posts do autor:", error);
            setAuthorPosts([{ _id: 'error', conteudo: 'Não foi possível carregar os posts do autor.', dataCriacao: new Date() }]);
        }
    };
    
    // ------------------------------------------------------------------
    // FUNÇÕES DE CRUD E INTERAÇÃO (LIKE/COMENTAR)
    // ------------------------------------------------------------------

    const handleCriarPost = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); 
        try {
            await axios.post('http://localhost:5000/api/posts', { conteudo: novoPost }, { headers: { 'x-auth-token': token } });
            setNovoPost(''); 
            carregarPosts(searchTerm); 
            carregarTopPosts(); 
        } catch (error) {
            alert('Erro ao criar post. Você está logado?');
        }
    };

    const handleDeletar = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir?")) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/posts/${id}`, { headers: { 'x-auth-token': token } });
            carregarPosts(searchTerm); 
            carregarTopPosts(); 
        } catch (error) {
            alert('Erro: Talvez você não tenha permissão de Admin.');
        }
    };
    
    const handleComentar = async (e, postId) => {
        e.preventDefault();
        const texto = e.target.elements.comentario.value;
        const token = localStorage.getItem('token');
        
        if (!texto) return;

        try {
            await axios.post(`http://localhost:5000/api/posts/${postId}/comments`,
                { texto },
                { headers: { 'x-auth-token': token } }
            );
            e.target.reset(); 
            carregarPosts(searchTerm); 
        } catch (error) {
            alert('Erro ao comentar. Verifique seu login.');
        }
    };

    const handleLikePost = async (postId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/posts/like/${postId}`, {}, { 
                headers: { 'x-auth-token': token } 
            });
            carregarPosts(searchTerm); 
            carregarTopPosts(); 
        } catch (error) {
            alert('Erro ao curtir post. Você está logado?');
        }
    };

    const handleLikeComment = async (commentId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/posts/comments/like/${commentId}`, {}, { 
                headers: { 'x-auth-token': token } 
            });
            carregarPosts(searchTerm); 
        } catch (error) {
            alert('Erro ao curtir comentário. Você está logado?');
        }
    };


    return (
        <div style={styles.mainLayout}>

            {/* 0. HEADER SUPERIOR COM TÍTULO, PERFIL LOGADO E PESQUISA CENTRALIZADA */}
            <header style={styles.topHeader}>
                <div style={styles.headerRow}>
                    <h2 style={styles.title}>Feed Acadêmico 💡</h2>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                         {/* Informações do usuário logado e botão sair */}
                        <span style={styles.userInfo}>
                            Olá, <strong>{user?.nome}</strong> ({user?.role}) 
                        </span>
                        <button 
                            onClick={() => { logout(); navigate('/'); }} 
                            style={styles.logoutButton}
                        >
                            Sair
                        </button>
                    </div>
                </div>

                <div style={styles.searchContainer}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="🔍 Pesquisar posts por conteúdo..."
                        style={styles.searchInput}
                    />
                </div>
            </header>
            
            {/* CONTAINER DAS 3 COLUNAS */}
            <div style={styles.columnContainer}>

                {/* 1. BARRA LATERAL ESQUERDA (PERFIL E POSTS DO AUTOR CLICADO) */}
                <div style={styles.leftSidebar}>
                    
                    {/* Card de Perfil do Autor Clicado */}
                    <div style={styles.authorProfileCard}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: selectedAuthorProfile ? '#ffeedd' : '#e0e7ff', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2em', color: selectedAuthorProfile ? '#f97316' : '#3b82f6' }}>
                            {selectedAuthorProfile ? selectedAuthorProfile.name[0].toUpperCase() : '👤'}
                        </div>
                        <p style={styles.authorNameDisplay}>
                            {selectedAuthorProfile ? selectedAuthorProfile.name : 'Selecione um Autor'}
                        </p>
                        <p style={styles.authorRoleDisplay}>
                            {selectedAuthorProfile ? selectedAuthorProfile.role : 'Nenhum perfil selecionado'}
                        </p>
                    </div>
                    
                    {/* Lista de Posts do Autor Clicado */}
                    <h3 style={{ fontSize: '1em', color: '#1e3a8a', marginBottom: '15px', borderBottom: '1px solid #e0e0e0', paddingBottom: '10px' }}>
                        Posts recentes:
                    </h3>

                    {selectedAuthorId === null ? (
                        <p style={{ color: '#6b7280', fontSize: '0.9em' }}>Clique no nome de um autor em qualquer post do feed para ver sua atividade aqui.</p>
                    ) : authorPosts.length === 0 ? (
                        <p>Carregando posts...</p>
                    ) : (
                        authorPosts.map(post => (
                            <div 
                                key={post._id} 
                                style={styles.authorPostCard}
                                onClick={() => scrollToPost(post._id)}
                            >
                                <p style={{ margin: '0 0 5px 0' }}>
                                    {post.conteudo.substring(0, 80)}
                                    {post.conteudo.length > 80 ? '...' : ''}
                                    <span style={{ color: '#10b981', fontWeight: 'bold' }}> [Ver]</span>
                                </p>
                                <small style={{ color: '#6b7280' }}>
                                    {new Date(post.dataCriacao).toLocaleDateString()}
                                </small>
                            </div>
                        ))
                    )}
                </div>


                {/* 2. CONTEÚDO PRINCIPAL (FEED) */}
                <div style={styles.feedContent}>
                    
                    {/* Formulário de Novo Post */}
                    <form onSubmit={handleCriarPost} style={{...styles.postCard, marginBottom: '30px'}}>
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
                    ) : posts.length === 0 && searchTerm ? (
                        <p style={{ textAlign: 'center', color: '#666' }}>Nenhum post encontrado para "**{searchTerm}**".</p>
                    ) : (
                        posts.map((post) => (
                            <div 
                                key={post._id} 
                                ref={el => postRefs.current[post._id] = el}
                                style={{
                                    ...styles.postCard,
                                    ...(highlightedPostId === post._id ? styles.highlightedPost : {})
                                }}
                            >
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
                                
                                {/* AÇÃO PRINCIPAL: Passa ID, Nome e ROLE para o handleViewAuthorPosts */}
                                <small style={styles.postMetadata}>
                                    Por: 
                                    <span 
                                        onClick={() => handleViewAuthorPosts(post.autor._id, post.autor.nome, post.autor.role)} 
                                        style={{ 
                                            cursor: 'pointer', 
                                            color: selectedAuthorId === post.autor._id ? '#ef4444' : '#1e3a8a', 
                                            fontWeight: 'bold', 
                                            textDecoration: 'underline' 
                                        }}
                                    >
                                        {post.autor?.nome}
                                    </span> 
                                    em {new Date(post.dataCriacao).toLocaleDateString()}
                                </small>
                                
                                {/* Seção de Like do Post */}
                                <div style={styles.likeSection}>
                                    <button
                                        onClick={() => handleLikePost(post._id)}
                                        style={{
                                            ...styles.likeButton,
                                            color: post.likes && post.likes.includes(user?.id) ? '#ef4444' : '#6b7280' 
                                        }}
                                    >
                                        ❤️ ({post.likes?.length || 0})
                                    </button>
                                </div>

                                <hr style={{ margin: '15px 0', border: '0', borderTop: '1px solid #f3f4f6' }} />

                                {/* Área de Comentários */}
                                <div style={styles.commentSection}>
                                    <h4 style={{fontSize: '1em', fontWeight: '600', color: '#4b5563', marginBottom: '10px'}}>Comentários:</h4>

                                    {post.comments && post.comments.map(comment => (
                                        <div key={comment._id} style={styles.commentText}>
                                            <span>
                                                <strong>{comment.autor?.nome}:</strong> {comment.texto}
                                            </span>
                                            {/* Like do Comentário */}
                                            <button
                                                onClick={() => handleLikeComment(comment._id)}
                                                style={{
                                                    ...styles.commentLikeButton,
                                                    color: comment.likes && comment.likes.includes(user?.id) ? '#3b82f6' : '#9ca3af' 
                                                }}
                                            >
                                                👍 ({comment.likes?.length || 0})
                                            </button>
                                        </div>
                                    ))}

                                    {post.comments?.length === 0 && <p style={{ fontSize: '0.8em', color: '#999' }}>Seja o primeiro a comentar!</p>}

                                    {/* Formulário de Comentar */}
                                    <form
                                        onSubmit={(e) => handleComentar(e, post._id)}
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

                {/* 3. BARRA LATERAL DIREITA (TOP POSTS MAIS CURTIDOS) */}
                <div style={styles.rightSidebar}>
                    <h3 style={{ fontSize: '1.2em', color: '#ef4444', marginBottom: '15px', borderBottom: '1px solid #e0e0e0', paddingBottom: '10px' }}>
                        ⭐ Top 10 Posts Mais Curtidos
                    </h3>

                    {topPosts.length === 0 ? (
                         <p style={{ color: '#6b7280', fontSize: '0.9em' }}>Carregando Top Posts...</p>
                    ) : (
                        topPosts.map((post, index) => (
                            <div 
                                key={post._id} 
                                style={styles.topPostCard}
                                onClick={() => scrollToPost(post._id)}
                            >
                                <p style={styles.topPostTitle}>
                                    {index + 1}. {post.conteudo.substring(0, 50)}...
                                </p>
                                <div style={styles.topPostLikes}>
                                    ❤️ {post.likes?.length || 0} curtidas | Por: {post.autor?.nome}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Feed;
