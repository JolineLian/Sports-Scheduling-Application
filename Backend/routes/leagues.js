import express from 'express';
import mongoose from 'mongoose';
import League from '../models/league.js'

const router = express.Router();

router.post('/', async(req, res) => {
    const league = req.body;

    if(!league.name) {
        return res.status(400).json({ message: 'Please provide name of league'});
    }

    const newLeague = new League(league);

    try {
        await newLeague.save();
        res.status(201).json({ message: 'League created', data: newLeague});
    } catch (error) {
        res.status(500).json({ message: 'Error creating league', error: error.message})
    }
})

router.get('/', async (req, res) => {
    try {
        const leagues = await League.find({})
        res.status(200).json({ leagues });
    } catch (error) {
        res.status(500).json({ message: 'Error getting leagues', error: error.message})
    }
})

router.put('/:id', async (req, res) => {
    const {id} = req.params;

    const league = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid id'})
    }

    try {
        const updatedLeague = await League.findByIdAndUpdate(id, league, {new: true});
        res.status(200).json({ message: 'League successfully updated', data: updatedLeague})
    } catch (error) {
        res.status(500).json({ message: 'Error updating league', error: error.message})
    }
})

router.delete('/:id', async (req,res) => {
    const {id} = req.params;

    try {
        await League.findByIdAndDelete(id);
        res.status(200).json({ message: 'League deleted'});
    } catch (error) {
        res.status(500).json({ message: 'Error deleting league', error: error.message})
    }
})

export default router;