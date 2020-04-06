const express = require('express');
const router = express.Router();
const Bulletin = require('../models/bulletin');

// Get all bulletins
router.get('/', async (req, res) => {
    try {
        const bulletins = await Bulletin.find().sort({ _id : -1 });
        res.json(bulletins);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one bulletin
router.get('/:id', getBulletin, (req, res) => {
    res.json(res.bulletin);
});

// Get one bulletin
router.get('/:id/upvote', getBulletin, async (req, res) => {
    res.bulletin.upvote = 1;
    res.bulletin.downvote = 0;
    try {
        await res.bulletin.save();
        res.json(res.bulletin);
    } catch(err) {
        res.status(404).json({ message: err.message });
    }
});

router.get('/:id/downvote', getBulletin, async (req, res) => {
    res.bulletin.upvote = 0;
    res.bulletin.downvote = 1;
    try {
        await res.bulletin.save();
        res.json(res.bulletin);
    } catch(err) {
        res.status(404).json({ message: err.message });
    }
});

// Create one bulletin
router.post('/', async (req, res) => {
    const bulletin = new Bulletin({
        title: req.body.title,
        content: req.body.content,
        tag: req.body.tag
    });

    try {
        const newBulletin = await bulletin.save();
        res.status(201).json({ message: 'Success' });
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
});

// Update one bulletin
router.patch('/:id', getBulletin, async (req, res) => {
    if(req.body.title != null) {
        res.bulletin.title = req.body.title;
    }

    if(req.body.content != null) {
        res.bulletin.content = req.body.content;
    }

    if(req.body.tag != null) {
        res.bulletin.tag = req.body.tag;
    }

    // res.bulletin.date = Date.now();

    try {
        const updatedBulletin = await res.bulletin.save();
        res.json({ message: 'Success' });
    } catch(err) {
        res.status(404).json({ message: err.message });
    }
});

// Delete one bulletin
router.delete('/:id', getBulletin, async (req, res) => {
    try {
        await res.bulletin.remove();
        res.json({ message: 'Success' });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Filtered Bulletins By Tag
router.post('/filter_and_order', async (req, res) => {
    const orderBy = req.body.orderBy;
    const filterBy = req.body.filterBy;
    let sort = -1;
    if( req.body.sort == "up" )
        sort = 1;

    try {
        let bulletins = [];
        if( filterBy == "all" ) {
            if( orderBy == "default" )
                bulletins = await Bulletin.find().sort({ _id : sort });
            else if( orderBy == "popularity" )
                bulletins = await Bulletin.find().sort({ upvote : sort });
            else if( orderBy == "title" )
                bulletins = await Bulletin.find().sort({ title : sort });
            else if( orderBy == "date" )
                bulletins = await Bulletin.find().sort({ date : sort });
        } else {
            if( orderBy == "default" )
                bulletins = await Bulletin.find({ "tag" : req.body.filterBy }).sort({ _id : sort });
            else if( orderBy == "popularity" )
                bulletins = await Bulletin.find({ "tag" : req.body.filterBy }).sort({ upvote : sort });
            else if( orderBy == "title" )
                bulletins = await Bulletin.find({ "tag" : req.body.filterBy }).sort({ title : sort });
            else if( orderBy == "date" )
                bulletins = await Bulletin.find({ "tag" : req.body.filterBy }).sort({ date : sort });
        }
        
        res.json(bulletins);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

async function getBulletin(req, res, next) {
    try {
        bulletin = await Bulletin.findById(req.params.id);

        if(bulletin == null) {
            return res.status(404).json({ message: 'Cant find bulletin' });
        }
    } catch(err) {
        return res.status(500).json({ message: err.message });
    }

    res.bulletin = bulletin;
    next();
}

module.exports = router