import mongoose from 'mongoose';

const { Schema } = mongoose;

const eventSchema = new Schema({
    event_type: {
        type: String,
        // required: true
    },
    date: {
        type: Date,
        // required: true
    },
    address: {
        type: String, 
        // Required: true
    },
    league: {
        type: String, 
        // Required: true
    },
    league_id: {
        type: Schema.Types.ObjectId, 
        ref: 'League',
    },
    division: {
        type: String, 
        // Required: true
    },
    team: {
        type: String,
        // required: true
    },
    opponent: {
        type: String,
        // required: true
    },
    play: {
        type: String,
        // required: true
    },
    back: {
        type: String,
        // required: true
    },
    notes: String
})

const Event = mongoose.model('Event', eventSchema);

export default Event;