import mongoose from 'mongoose';

const leagueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    divisions: {
        type: Array,
    }
})

const League = mongoose.model('League', leagueSchema);

export default League;