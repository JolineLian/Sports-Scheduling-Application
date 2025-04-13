import express from 'express';
import mongoose from 'mongoose';
import League from '../models/league.js'

const router = express.Router();

router.post('/', async (req, res) => {
    const league = req.body;

    if (!league.name) {
        return res.status(400).json({ message: 'Please provide name of league' });
    }

    if (!Number.isInteger(league.division) || league.division <= 0) {
        return res.status(400).json({ message: 'Please provide a valid number for divisions' });
    }

    const divisions = Array.from({ length: league.division }, (_, i) => `division ${i + 1}`);

    const newLeague = new League({
        ...league,
        divisions: divisions
    });

    try {
        await newLeague.save();
        res.status(201).json({ newLeague });
    } catch (error) {
        res.status(500).json({ message: 'Error creating league', error: error.message });
    }
});


router.get('/', async (req, res) => {
    try {
        const leagues = await League.find({})
        res.status(200).json({ leagues });
    } catch (error) {
        res.status(500).json({ message: 'Error getting leagues', error: error.message})
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const league = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid id' });
    }

    if (league.division) {
        if (!Number.isInteger(league.division) || league.division <= 0) {
            return res.status(400).json({ message: 'Please provide a valid number for divisions' });
        }

        league.divisions = Array.from({ length: league.division }, (_, i) => `division ${i + 1}`);
    }

    try {
        const updatedLeague = await League.findByIdAndUpdate(id, league, { new: true });

        if (!updatedLeague) {
            return res.status(404).json({ message: 'League not found' });
        }

        res.status(200).json({ updatedLeague });
    } catch (error) {
        res.status(500).json({ message: 'Error updating league', error: error.message });
    }
});


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