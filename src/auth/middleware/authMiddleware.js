const jwt = require('jsonwebtoken');
const User = require('../../user/user.model');

// نتحققو من الـ token ونحطو المستخدم في req.user
const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur introuvable' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

// برك المانجر يعدّي (لازم يجي بعد auth)
const isManager = (req, res, next) => {
  if (req.user.role !== 'manager') {
    return res.status(403).json({ message: 'Accès réservé au manager' });
  }
  next();
};

module.exports = { auth, isManager };