const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const { protect, authorize } = require('../middleware/auth');

// VIEWER: Only see PUBLISHED content 
router.get('/published', protect, async (req, res) => {
    const content = await Content.find({ status: 'PUBLISHED' }).populate('author', 'username');
    res.json(content);
});

// AUTHOR: Create Drafts
router.post('/', protect, authorize('AUTHOR'), async (req, res) => {
    const newContent = await Content.create({ ...req.body, author: req.user.id });
    res.status(201).json(newContent);
});

// AUTHOR: Edit Drafts (CRITICAL IMMUTABILITY CHECK) 
router.put('/:id', protect, authorize('AUTHOR'), async (req, res) => {
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ message: "Not found" });

    if (content.status === 'PUBLISHED') {
        return res.status(403).json({ message: "Published content is immutable" });
    }

    const updated = await Content.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

// EDITOR/ADMIN: Review & Manage
router.get('/pending', protect, authorize('EDITOR', 'ADMIN'), async (req, res) => {
    const pending = await Content.find({ status: 'PENDING' }).populate('author', 'username');
    res.json(pending);
});


// Allow both Editor and Admin to patch status
router.patch('/:id/status', protect, authorize('EDITOR', 'ADMIN'), async (req, res) => {
    const { status } = req.body;
    const content = await Content.findById(req.params.id);

    if (content.status === 'PUBLISHED' && status !== 'PUBLISHED') {
        return res.status(403).json({ message: "Rejected: Published content is immutable" });
    }

    const updated = await Content.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updated);
});

// ADMIN: Master list of all content in the system
router.get('/all', protect, authorize('ADMIN'), async (req, res) => {
    try {
        const allContent = await Content.find().populate('author', 'username');
        res.json(allContent);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// AUTHOR: View own content and its status
router.get('/my', protect, authorize('AUTHOR'), async (req, res) => {
    try {
        const myContent = await Content.find({ author: req.user.id });
        res.json(myContent);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving your content" });
    }
});

module.exports = router;