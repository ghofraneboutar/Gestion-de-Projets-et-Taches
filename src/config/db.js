const mongoose = require('mongoose');
//connexion à la base de données MongoDB
module.exports = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connecté');
};