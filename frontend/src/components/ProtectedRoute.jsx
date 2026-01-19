import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

const ProtectedRoute = ({ children, allowedRole }) => {
    const { user } = useContext(AuthContext);

    if (!user) return <Navigate to="/login" />;
    if (user.role !== allowedRole) return <Navigate to="/login" />;
    
    return children;
};

export default ProtectedRoute;