import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Admin from './Pages/Admin';
import Portfolio from './Pages/Portfolio';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<Login />} /> {/* Redirection par défaut vers login */}
        <Route path="/portfolio" element={<Portfolio />} /> {/* Redirection par défaut vers login */}
      </Routes>
    </Router>
  );
}

export default App;