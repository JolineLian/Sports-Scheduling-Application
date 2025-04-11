import express from 'express';
import { connectDB } from './config/db.js';
import leagueRoutes from './routes/leagues.js';
import teamRoutes from './routes/teams.js';
import eventRoutes from './routes/events.js';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import protectedRoutes from './routes/protected.js';

const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());
// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true
// }))

app.use(cors({
    origin: '*',  // Allow all origins for testing (not recommended for production)
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization'
  }));

app.use('/api/leagues', leagueRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/events', eventRoutes);
app.use('/api', authRoutes);
app.use('/api', protectedRoutes);


app.listen(PORT, () => {
    connectDB();
    console.log(`Server started at http://localhost:${PORT}`)
});