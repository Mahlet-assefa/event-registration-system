import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';

function Navigation() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow-sm">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-blue-600">EventSys</Link>
                <div className="space-x-4">
                    <Link to="/" className="text-gray-600 hover:text-blue-600">Events</Link>
                    {user ? (
                        <>
                            {user.isAdmin && <Link to="/admin" className="text-gray-600 hover:text-blue-600">Admin</Link>}
                            <span className="text-gray-800 font-medium">Hello, {user.username}</span>
                            <button
                                onClick={logout}
                                className="text-red-500 hover:text-red-700"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
                            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <Navigation />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><Admin /></ProtectedRoute>} />
                        <Route path="/" element={<Dashboard />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
