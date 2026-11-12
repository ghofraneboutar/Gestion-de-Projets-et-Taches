const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom:       { type: String, required: [true, 'nom requis'], trim: true },
  login:     { type: String, required: [true, 'login requis'], unique: true, trim: true }, 
  password:  { type: String, required: [true, 'mot de passe requis'], minlength: 6 },      
  role:      { type: String, enum: ['user', 'manager'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

// ما نرجعوش الباسوورد في الـ réponse
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);