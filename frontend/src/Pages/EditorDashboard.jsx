import { useState, useEffect, useContext } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Button, Stack, Chip } from '@mui/material';
import { CheckCircle, Block } from '@mui/icons-material';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';

const EditorDashboard = () => {
    const [pending, setPending] = useState([]);
    const { user } = useContext(AuthContext);

    const fetchPending = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/content/pending`, {
            headers: { Authorization: `Bearer ${user.token}` }
        });
        setPending(res.data);
    };

    const updateStatus = async (id, status) => {
        await axios.patch(`${import.meta.env.VITE_API_URL}/content/${id}/status`, 
            { status }, 
            { headers: { Authorization: `Bearer ${user.token}` } }
        );
        fetchPending();
    };

    useEffect(() => { fetchPending(); }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Review Pipeline</Typography>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                            <TableCell>Title</TableCell>
                            <TableCell>Content Snippet</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pending.map((row) => (
                            <TableRow key={row._id}>
                                <TableCell>{row.title}</TableCell>
                                <TableCell>{row.body.substring(0, 50)}...</TableCell>
                                <TableCell align="center">
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        <Button startIcon={<CheckCircle />} color="success" onClick={() => updateStatus(row._id, 'PUBLISHED')}>Publish</Button>
                                        <Button startIcon={<Block />} color="error" onClick={() => updateStatus(row._id, 'REJECTED')}>Reject</Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
};

export default EditorDashboard;