require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') }); // Laster inn .env fra rotmappen
console.log("Database passord lastet:", process.env.DB_PASSWORD ? "JA" : "NEI");
const express = require('express');
const cors = require('cors');
const userRoutes = require('./V1/Routes/userRoutes'); // Banen til dine nye ruter

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Tillater React (i morgen) å snakke med API-et
app.use(express.json()); // Gjør at API-et forstår JSON i POST/PUT requests

// Ruter
app.use('/api/v1/user', userRoutes);

// Enkel helsesjekk (valgfritt)
app.get('/', (req, res) => {
    res.send('API-et kjører og er klart for forespørsler!');
});

// Start server
app.listen(PORT, () => {
  console.log(`-----------------------------------------`);
  console.log(`Server kjører på: http://localhost:${PORT}`);
  console.log(`JWT_SECRET er lastet: ${process.env.JWT_SECRET ? 'JA' : 'NEI'}`);
  console.log(`-----------------------------------------`);
});