require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();


app.use(express.json());

// route نجرب بيها
app.get('/', (req, res) => {
  res.json({ message: 'API en marche' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connecté');
    app.listen(process.env.PORT || 3000, () =>
      console.log('Serveur lancé sur le port', process.env.PORT || 3000)
    );
  })
  .catch((err) => console.error('Erreur MongoDB :', err.message));