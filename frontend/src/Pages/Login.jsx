import { useState, useContext } from 'react';
import { Container, Box, TextField, Button, Typography, Paper, Alert, Link as MuiLink } from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import axios from 'axios';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, credentials);
            login(res.data);
            
            const roleRedirects = {
                ADMIN: '/admin',
                EDITOR: '/editor',
                AUTHOR: '/author',
                VIEWER: '/viewer'
            };
            navigate(roleRedirects[res.data.role] || '/login');
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ 
                minHeight: '80vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                px: { xs: 2, sm: 0 } 
            }}>
                <Paper elevation={6} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2, width: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <LoginIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', mb: 3 }}>
                            Sign In
                        </Typography>
                        
                        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
                        
                        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                            <TextField 
                                fullWidth 
                                label="Username *" 
                                margin="normal" 
                                variant="outlined"
                                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                                required 
                            />
                            <TextField 
                                fullWidth 
                                label="Password *" 
                                type="password" 
                                margin="normal" 
                                variant="outlined"
                                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                                required 
                            />
                            <Button 
                                type="submit" 
                                fullWidth 
                                variant="contained" 
                                size="large"
                                sx={{ mt: 3, mb: 2, py: 1.2, fontWeight: 'bold' }}
                            >
                                LOGIN
                            </Button>
                            
                            <Typography variant="body2" align="center">
                                Don't have an account?{' '}
                                <MuiLink component={Link} to="/register" sx={{ textDecoration: 'none', fontWeight: 'bold' }}>
                                    Register here
                                </MuiLink>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;