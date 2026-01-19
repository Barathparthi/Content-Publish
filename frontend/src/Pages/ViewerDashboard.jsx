import { useEffect, useState, useContext } from 'react';
import { Container, Typography, Card, CardContent, Grid, Divider } from '@mui/material';
import { Article } from '@mui/icons-material';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';

const ViewerDashboard = () => {
    const [feed, setFeed] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/content/published`, {
            headers: { Authorization: `Bearer ${user.token}` }
        }).then(res => setFeed(res.data));
    }, [user.token]);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Published Feed</Typography>
            <Grid container spacing={3}>
                {feed.map(post => (
                    <Grid item xs={12} key={post._id}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h5" color="primary">{post.title}</Typography>
                                <Typography variant="caption">Published by: {post.author.username}</Typography>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="body1">{post.body}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};
export default ViewerDashboard;