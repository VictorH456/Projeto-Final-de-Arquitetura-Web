import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register'; // <--- Importe aqui
import Feed from './pages/Feed';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* <--- Atualize aqui */}
          <Route path="/feed" element={<Feed />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;