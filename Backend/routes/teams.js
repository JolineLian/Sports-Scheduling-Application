import express from 'express';
import mongoose from 'mongoose';
import Team from '../models/team.js'

const router = express.Router();

router.post('/', async(req, res) => {
    const team = req.body;

    if(!team.name || !team.league_id || !team.division) {
        return res.status(400).json({ message: 'Please enter the necessary information to create team'});
    }

    const newTeam = new Team(team);

    try {
        await newTeam.save();
        res.status(201).json({newTeam});
    } catch (error) {
        res.status(500).json({ message: 'Error creating team', error: error.message})
    }
})

router.get('/', async (req, res) => {
    try {
        const teams = await Team.find({})
        res.status(200).json({ teams });
    } catch (error) {
        res.status(500).json({ message: 'Error getting Teams', error: error.message})
    }
})

router.get('/leagues', async (req, res) => {
    const { league } = req.query;

    try {
        const teams = await Team.find({league_id: new mongoose.Types.ObjectId( league )})
        res.status(200).json({ teams });
    } catch (error) {
        res.status(500).json({ message: 'Error getting Teams', error: error.message})
    }
})

router.put('/:id', async (req, res) => {
    const {id} = req.params;

    const team = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid id'})
    }

    try {
        const updatedTeam = await Team.findByIdAndUpdate(id, team, {new: true});
        res.status(200).json({ message: 'Team successfully updated', data: updatedTeam})
    } catch (error) {
        res.status(500).json({ message: 'Error updating team', error: error.message})
    }
})

router.delete('/:id', async (req,res) => {
    const {id} = req.params;

    try {
        await Team.findByIdAndDelete(id);
        res.status(200).json({ message: 'Team deleted'});
    } catch (error) {
        res.status(500).json({ message: 'Error deleting team', error: error.message})
    }
})

export default router;
