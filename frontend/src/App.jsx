import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './Pages/Login';
import Register from './Pages/Register';
import AuthorDashboard from './Pages/AuthorDashboard';
import EditorDashboard from './Pages/EditorDashboard';
import AdminDashboard from './Pages/AdminDashboard';
import ViewerDashboard from './Pages/ViewerDashboard';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      
        <Route path="/author" element={<ProtectedRoute allowedRole="AUTHOR"><AuthorDashboard /></ProtectedRoute>} />
        <Route path="/editor" element={<ProtectedRoute allowedRole="EDITOR"><EditorDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute allowedRole="ADMIN"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/viewer" element={<ProtectedRoute allowedRole="VIEWER"><ViewerDashboard /></ProtectedRoute>} />
        
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}
export default App;