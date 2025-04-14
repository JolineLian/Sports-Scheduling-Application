import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true
    },
    league_id: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true
    },
    division: {
        type: String,
        // required: true
    }
})

const Team = mongoose.model('Team', teamSchema);

export default Team;