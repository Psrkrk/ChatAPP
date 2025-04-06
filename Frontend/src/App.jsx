import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/User/Signup';
import Login from './pages/User/Login';
import Home from './pages/User/Home';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to /signup */}
        <Route path="/" element={<Navigate to="/signup" />} />

        {/* Auth pages */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected page example */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
