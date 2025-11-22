import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminResultsPage from './pages/AdminResultsPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <main className="container">
      <Navbar />
      <Routes>
        <Route
            path="/"
            element={
                <ProtectedRoute><DashboardPage /></ProtectedRoute>
            }
        />
        <Route
            path="/admin"
            element={
                <ProtectedRoute adminOnly={true}><AdminDashboardPage /></ProtectedRoute>
            }
        />
        <Route
            path="/admin/results"
            element={
                <ProtectedRoute adminOnly={true}><AdminResultsPage /></ProtectedRoute>
            }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </main>
  );
}

export default App;
