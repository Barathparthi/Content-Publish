import { AppBar, Toolbar, Typography, Button, Box, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Logout, AccountCircle } from '@mui/icons-material';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const theme = useTheme();
    
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="sticky" elevation={3}>
            <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>
                {/* Responsive Title */}
                <Typography 
                    variant="h6" 
                    component="div" 
                    onClick={() => navigate('/')}
                    sx={{ 
                        flexGrow: 1, 
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: { xs: '1.1rem', sm: '1.25rem' } 
                    }}
                >
                    {isMobile ? 'CMS' : 'Content Workflow System'}
                </Typography>

                {user && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                            <AccountCircle fontSize="small" />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {user.username}
                            </Typography>
                            <Box 
                                component="span" 
                                sx={{ 
                                    bgcolor: 'rgba(255,255,255,0.2)', 
                                    px: 1, 
                                    py: 0.2, 
                                    borderRadius: 1, 
                                    fontSize: '0.75rem' 
                                }}
                            >
                                {user.role}
                            </Box>
                        </Box>
                        <Button 
                            color="inherit" 
                            onClick={handleLogout} 
                            variant={isMobile ? "text" : "outlined"}
                            size={isMobile ? "small" : "medium"}
                            startIcon={<Logout />}
                            sx={{ 
                                borderColor: 'rgba(255,255,255,0.5)',
                                '&:hover': { borderColor: '#fff' },
                                minWidth: isMobile ? 'auto' : '100px'
                            }}
                        >
                            {!isMobile && 'Logout'}
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;