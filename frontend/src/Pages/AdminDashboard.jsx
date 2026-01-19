import { useEffect, useState, useContext } from 'react';
import { 
    Container, Typography, Paper, Table, TableBody, TableCell, TableHead, 
    TableRow, Chip, TableContainer, IconButton, Stack, Tooltip, 
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button 
} from '@mui/material';
import { AdminPanelSettings, Edit, Publish, Drafts, Visibility } from '@mui/icons-material';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';

const AdminDashboard = () => {
    const [allContent, setAllContent] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const { user } = useContext(AuthContext);

    const fetchAll = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/content/all`, {
            headers: { Authorization: `Bearer ${user.token}` }
        });
        setAllContent(res.data);
    };

    const handleAction = async (id, payload) => {
        try {
            if (payload.status) {
                await axios.patch(`${import.meta.env.VITE_API_URL}/content/${id}/status`, 
                    payload, { headers: { Authorization: `Bearer ${user.token}` } });
            } else {
                await axios.put(`${import.meta.env.VITE_API_URL}/content/${id}`, 
                    payload, { headers: { Authorization: `Bearer ${user.token}` } });
            }
            setIsModalOpen(false);
            fetchAll();
        } catch (err) {
            alert(err.response?.data?.message || "Action failed");
        }
    };

    const openModal = (item, edit = false) => {
        setSelectedItem({ ...item });
        setIsEditMode(edit);
        setIsModalOpen(true);
    };

    useEffect(() => { fetchAll(); }, [user.token]);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <AdminPanelSettings sx={{ mr: 2, fontSize: 40 }} color="primary" /> System Administration
            </Typography>

            <TableContainer component={Paper} elevation={4} sx={{ borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Author</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allContent.map((item) => (
                            <TableRow key={item._id} hover>
                                <TableCell>{item.title}</TableCell>
                                <TableCell>{item.author?.username}</TableCell>
                                <TableCell>
                                    <Chip label={item.status} color={item.status === 'PUBLISHED' ? 'success' : 'primary'} variant="outlined" size="small" />
                                </TableCell>
                                <TableCell align="center">
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        <Tooltip title="View"><IconButton onClick={() => openModal(item, false)}><Visibility color="info" /></IconButton></Tooltip>
                                        
                                        <Tooltip title="Publish">
                                            <span>
                                                <IconButton onClick={() => handleAction(item._id, { status: 'PUBLISHED' })} disabled={item.status === 'PUBLISHED'}>
                                                    <Publish color={item.status === 'PUBLISHED' ? 'disabled' : 'success'} />
                                                </IconButton>
                                            </span>
                                        </Tooltip>

                                        <Tooltip title="Revert to Draft">
                                            <span>
                                                <IconButton onClick={() => handleAction(item._id, { status: 'DRAFT' })} disabled={item.status === 'PUBLISHED'}>
                                                    <Drafts color={item.status === 'PUBLISHED' ? 'disabled' : 'warning'} />
                                                </IconButton>
                                            </span>
                                        </Tooltip>

                                        <Tooltip title="Edit">
                                            <span>
                                                <IconButton onClick={() => openModal(item, true)} disabled={item.status === 'PUBLISHED'}>
                                                    <Edit color={item.status === 'PUBLISHED' ? 'disabled' : 'primary'} />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{isEditMode ? "Edit Content" : "View Content"}</DialogTitle>
                <DialogContent>
                    <TextField 
                        fullWidth label="Title" margin="normal" 
                        value={selectedItem?.title || ''} 
                        disabled={!isEditMode}
                        onChange={(e) => setSelectedItem({...selectedItem, title: e.target.value})}
                    />
                    <TextField 
                        fullWidth multiline rows={4} label="Body" margin="normal" 
                        value={selectedItem?.body || ''} 
                        disabled={!isEditMode}
                        onChange={(e) => setSelectedItem({...selectedItem, body: e.target.value})}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setIsModalOpen(false)}>Close</Button>
                    {isEditMode && (
                        <Button variant="contained" onClick={() => handleAction(selectedItem._id, { title: selectedItem.title, body: selectedItem.body })}>
                            Save Changes
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminDashboard;