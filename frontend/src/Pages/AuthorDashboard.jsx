import { useState, useEffect, useContext } from 'react';
import { Container, TextField, Button, Typography, Paper, List, ListItem, ListItemText, Chip, Box, Divider } from '@mui/material';
import { AddCircleOutline, History } from '@mui/icons-material';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';

const AuthorDashboard = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [contentList, setContentList] = useState([]);
    const { user } = useContext(AuthContext);

    const fetchMyContent = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/content/my`, {
            headers: { Authorization: `Bearer ${user.token}` }
        });
        setContentList(res.data);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/content`, 
                { title, body }, 
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setTitle(''); setBody('');
            fetchMyContent();
        } catch (err) { alert("Submission failed"); }
    };

    useEffect(() => { fetchMyContent(); }, []);

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper sx={{ p: 4, mb: 4 }}>
                <Typography variant="h5" gutterBottom display="flex" alignItems="center">
                    <AddCircleOutline sx={{ mr: 1 }} /> Create New Draft
                </Typography>
                <form onSubmit={handleCreate}>
                    <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} margin="normal" required />
                    <TextField fullWidth multiline rows={4} label="Content Body" value={body} onChange={(e) => setBody(e.target.value)} margin="normal" required />
                    <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }}>Submit for Review</Button>
                </form>
            </Paper>

            <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                <History sx={{ mr: 1 }} /> My Submissions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
                {contentList.map((item) => (
                    <Paper key={item._id} sx={{ mb: 2, p: 1 }}>
                        <ListItem secondaryAction={
                            <Chip 
                                label={item.status} 
                                color={item.status === 'PUBLISHED' ? 'success' : item.status === 'REJECTED' ? 'error' : 'primary'} 
                            />
                        }>
                            <ListItemText primary={item.title} secondary={item.body} />
                        </ListItem>
                    </Paper>
                ))}
            </List>
        </Container>
    );
};

export default AuthorDashboard;