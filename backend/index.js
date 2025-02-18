require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');

const { Pool } = require('pg');

const PORT = process.env.PORT || 5000;

// app.use(cors({
//     origin: ''     
// }));
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client from pool', err.stack);
        return;
    }

    console.log('Successfully connected to PostgreSQL');
    release();   
});

app.get('/', (req, res) => {
    res.send('Welcome to your scheduling app API')
});

app.get('/api/schedules', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM schedules');
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).json({ error: 'Database query failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
