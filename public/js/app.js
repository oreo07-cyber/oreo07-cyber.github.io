const express = require('express');
const { searchFlights } = require('./amadeus');
const { getTravelDestination } = require('./openai');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));  // Ensure you have a 'public' folder for static files

app.post('/find-destination', async (req, res) => {
  const { prompt } = req.body;
  const destination = await getTravelDestination(prompt);
  res.json({ destination });
});

app.post('/search-flights', async (req, res) => {
  const { origin, destination, departureDate } = req.body;
  const flights = await searchFlights(origin, destination, departureDate);
  res.json({ flights });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
