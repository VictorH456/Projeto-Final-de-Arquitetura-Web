import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Feed() {
    const [posts, setPosts] = useState([]);
    const [novoPost, setNovoPost] = useState('');
    const [loading, setLoading] = useState(true);

    const { user, logout } = useContext(AuthContext); // Pegamos dados do usuário e função de sair
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
        const token = localStorage.getItem('token'); // Recupera o token salvo

        try {
            await axios.post('http://localhost:5000/api/posts',
                { conteudo: novoPost },
                { headers: { 'x-auth-token': token } } // Envia o token no cabeçalho
            );
            setNovoPost(''); // Limpa o campo
            carregarPosts(); // Recarrega a lista para mostrar o novo post
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
            carregarPosts(); // Atualiza a lista
        } catch (error) {
            alert('Erro: Talvez você não tenha permissão de Admin.');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>

            {/* Cabeçalho Simples */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Feed Acadêmico</h2>
                <div>
                    <span>Olá, <strong>{user?.nome}</strong> ({user?.role}) </span>
                    <button onClick={() => { logout(); navigate('/'); }} style={{ marginLeft: '10px', background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
                        Sair
                    </button>
                </div>
            </header>

            {/* Formulário de Novo Post */}
            <form onSubmit={handleCriarPost} style={{ marginBottom: '30px', border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                <textarea
                    value={novoPost}
                    onChange={(e) => setNovoPost(e.target.value)}
                    placeholder="Compartilhe sua dúvida ou conhecimento..."
                    required
                    style={{ width: '100%', height: '80px', marginBottom: '10px', padding: '10px', boxSizing: 'border-box' }}
                />
                <button type="submit" style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>
                    Publicar
                </button>
            </form>

            {/* Lista de Posts */}
            {posts.map((post) => (
                <div key={post._id} style={{ border: '1px solid #eee', padding: '15px', marginBottom: '15px', borderRadius: '8px', background: '#f9f9f9' }}>
                    <p style={{ fontSize: '1.1em', margin: '0 0 10px 0' }}>{post.conteudo}</p>
                    <small style={{ color: '#666', display: 'block', marginBottom: '10px' }}>
                        Por: <strong>{post.autor?.nome}</strong> em {new Date(post.dataCriacao).toLocaleDateString()}
                    </small>

                    {/* Botão Excluir (Admin) */}
                    {user?.role === 'admin' && (
                        <button
                            onClick={() => handleDeletar(post._id)}
                            style={{ float: 'right', background: 'transparent', color: 'red', border: 'none', cursor: 'pointer', fontSize: '0.8em' }}
                        >
                            [X] Excluir Post
                        </button>
                    )}

                    <hr style={{ margin: '10px 0', border: '0', borderTop: '1px solid #eee' }} />

                    {/* Área de Comentários */}
                    <div style={{ background: '#fff', padding: '10px', borderRadius: '5px' }}>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9em' }}>Comentários:</h4>

                        {post.comments && post.comments.map(comment => (
                            <div key={comment._id} style={{ fontSize: '0.85em', marginBottom: '5px', borderBottom: '1px dotted #ccc', paddingBottom: '2px' }}>
                                <strong>{comment.autor?.nome}:</strong> {comment.texto}
                            </div>
                        ))}

                        {post.comments?.length === 0 && <p style={{ fontSize: '0.8em', color: '#999' }}>Seja o primeiro a comentar!</p>}

                        {/* Formulário de Comentar */}
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const texto = e.target.elements.comentario.value;
                                const token = localStorage.getItem('token');
                                await axios.post(`http://localhost:5000/api/posts/${post._id}/comments`,
                                    { texto },
                                    { headers: { 'x-auth-token': token } }
                                );
                                e.target.reset(); // Limpa o input
                                carregarPosts(); // Atualiza a tela
                            }}
                            style={{ marginTop: '10px', display: 'flex' }}
                        >
                            <input
                                name="comentario"
                                type="text"
                                placeholder="Escreva um comentário..."
                                required
                                style={{ flex: 1, padding: '5px', fontSize: '0.9em' }}
                            />
                            <button type="submit" style={{ marginLeft: '5px', padding: '5px 10px', fontSize: '0.8em', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
                                Enviar
                            </button>
                        </form>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Feed;