const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Music API route
app.get('/api/music', async (req, res) => {
  try {
    const { mood, language } = req.query;

    // Log the received parameters for debugging
    console.log(`Received request for mood: ${mood}, language: ${language}`);

    // Mock music data (replace this with Audius API call later)
    const mockTracks = [
      { 
        id: '1', 
        title: `${mood} Song 1`, 
        artist: 'Artist 1', 
        artwork: 'https://via.placeholder.com/150'
      },
      { 
        id: '2', 
        title: `${mood} Song 2`, 
        artist: 'Artist 2', 
        artwork: 'https://via.placeholder.com/150'
      },
      { 
        id: '3', 
        title: `${mood} Song 3`, 
        artist: 'Artist 3', 
        artwork: 'https://via.placeholder.com/150'
      },
      { 
        id: '4', 
        title: `${language} Hit`, 
        artist: 'Top Artist', 
        artwork: 'https://via.placeholder.com/150'
      },
    ];

    res.json(mockTracks);
  } catch (error) {
    console.error('Error fetching music:', error);
    res.status(500).json({ error: 'Failed to fetch music data' });
  }
});

// Server listens on 0.0.0.0 for external access
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
