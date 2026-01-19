import { useState } from 'react';
import { Container, Box, TextField, Button, Typography, MenuItem, Paper, Alert, Link as MuiLink } from '@mui/material';
import { AppRegistration } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '', role: 'AUTHOR' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <Box sx={{ 
            width: '100vw', 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: '#121212' 
        }}>
            <Container maxWidth="xs">
                <Paper elevation={10} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <AppRegistration color="primary" sx={{ fontSize: 50, mb: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>Register</Typography>
                        
                        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
                        
                        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                            <TextField 
                                fullWidth label="Username *" margin="normal" required 
                                onChange={(e) => setFormData({...formData, username: e.target.value})} 
                            />
                            <TextField 
                                fullWidth label="Password *" type="password" margin="normal" required 
                                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                            />
                            <TextField 
                                fullWidth select label="Role *" value={formData.role} margin="normal"
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                            >
                                <MenuItem value="AUTHOR">Author</MenuItem>
                                <MenuItem value="EDITOR">Editor</MenuItem>
                                <MenuItem value="VIEWER">Viewer</MenuItem>
                                <MenuItem value="ADMIN">Admin</MenuItem>
                            </TextField>
                            
                            <Button 
                                type="submit" fullWidth variant="contained" size="large"
                                sx={{ mt: 4, mb: 2, py: 1.5, fontWeight: 'bold' }}
                            >
                                CREATE ACCOUNT
                            </Button>
                            
                            <Typography variant="body2" align="center">
                                Already have an account?{' '}
                                <MuiLink component={Link} to="/login" sx={{ fontWeight: 'bold', textDecoration: 'none' }}>
                                    Login here
                                </MuiLink>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Register;