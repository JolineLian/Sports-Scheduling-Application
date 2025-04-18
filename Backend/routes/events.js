import express from 'express';
import mongoose from 'mongoose';
import Event from '../models/event.js'

const router = express.Router();

router.post('/', async(req, res) => {
    const event = req.body;

    if(!event.event_type || !event.date || !event.address || !event.league || !event.league_id || !event.division || !event.team || !event.play || !event.back) {
        return res.status(400).json({ message: 'Please enter the necessary information to create event'});
    }

    const newEvent = new Event(event);

    try {
        event.date = new Date(req.body.date);
        event.league_id = mongoose.Types.ObjectId.createFromHexString(event.league_id);  // Correct way to create ObjectId

        await newEvent.save();
        res.status(201).json({ newEvent });
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error: error.message})
    }
})

router.get('/', async (req, res) => {
    try {
        const events = await Event.find({})
        res.status(200).json({ events });
    } catch (error) {
        res.status(500).json({ message: 'Error getting event', error: error.message})
    }
})

router.get('/filter', async (req, res) => {
    const { type, startDate, endDate, league, team, opponent } = req.query;

    try {
        let query = {};

        // Logging the query parameters for debugging
        console.log('Received query parameters:', req.query);

        if (type) {
            query.event_type = type; // Assuming event_type is the correct field in your schema
        }

        if (league) {
            query.league_id = new mongoose.Types.ObjectId(league); // Make sure league is a valid ObjectId
        }

        if (team) {
            query.team = team;
        }

        if (opponent) {
            query.opponent = opponent;
        }

        // Handle date range filtering if both startDate and endDate are provided
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            console.log('Start Date:', start);
            console.log('End Date:', end);


            query.date = { $gte: start, $lte: end };
        }

        // Logging the final query object before querying MongoDB
        console.log('Final Query Object:', query);

        // Execute the query in MongoDB
        const events = await Event.find(query).exec();

        // If no events found, return an empty array
        if (events.length === 0) {
            console.log('No events found matching the query.');
        }

        res.status(200).json({ events });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Error getting events', error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const {id} = req.params;

    const event = req.body;

    try {
        event.date = new Date(req.body.date);
        event.league_id = mongoose.Types.ObjectId.createFromHexString(event.league_id);  // Correct way to create ObjectId

        const updatedEvent = await Event.findByIdAndUpdate(id, event, {new: true});
        res.status(200).json({ updatedEvent })
    } catch (error) {
        res.status(500).json({ message: 'Error updating event', error: error.message})
    }
})

router.delete('/:id', async (req,res) => {
    const {id} = req.params;

    try {
        await Event.findByIdAndDelete(id);
        res.status(200).json({ message: 'Event deleted'});
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error: error.message})
    }
})

export default router;
