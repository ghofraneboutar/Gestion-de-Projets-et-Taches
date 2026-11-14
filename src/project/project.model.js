const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  nom:         { type: String, required: [true, 'nom du projet requis'], trim: true },
  description: { type: String, trim: true },
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  statut:      { type: String, enum: ['en cours', 'terminé', 'en pause'], default: 'en cours' },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);