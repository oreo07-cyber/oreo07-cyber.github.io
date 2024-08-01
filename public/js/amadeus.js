require('dotenv').config();
const Amadeus = require('amadeus');

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_API_SECRET,
});

async function searchFlights(origin, destination, departureDate) {
  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departureDate,
      adults: 1,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

module.exports = { searchFlights };
