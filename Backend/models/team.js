import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true
    },
    league: {
        type: String,
        // required: true
    },
    division: {
        type: String,
        // required: true
    }
})

const Team = mongoose.model('Team', teamSchema);

export default Team;