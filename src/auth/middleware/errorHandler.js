module.exports = (err, req, res, next) => {
  // خطأ validation متاع Mongoose kima statut
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: 'Données invalides', errors: messages });
  }
  // ID غالط 
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'ID ou valeur invalide' });
  }
  // doublon
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Valeur déjà utilisée' });
  }
  console.error(err);
  res.status(500).json({ message: 'Erreur serveur' });
};