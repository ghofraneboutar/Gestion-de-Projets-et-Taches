const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  titre:       { type: String, required: [true, 'titre requis'], trim: true },
  description: { type: String, trim: true },
  statut:      { type: String, enum: ['todo', 'doing', 'done'], default: 'todo' },
  deadline:    { type: Date },
  project:     { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);