const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../user/user.model');

// نعملو token فيه id و role
const genererToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN  }
  );


exports.register = async (req, res, next) => {
  try {
    const { nom, login, password, role } = req.body;

    // نتاكدوا les champs sont remplis
    if (!nom || !login || !password) {
      return res.status(400).json({ message: 'nom, login et password sont requis' });
    }

    const existe = await User.findOne({ login });
    if (existe) {
      return res.status(409).json({ message: 'Ce login est déjà utilisé' });
    }

    // نشفّرو الباسوورد قبل ما نخزّنوه
    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({ nom, login, password: hash, role });

    res.status(201).json({ user, token: genererToken(user) });
  } catch (err) {
    next(err);
  }
};


exports.login = async (req, res, next) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ message: 'login et password sont requis' });
    }

    const user = await User.findOne({ login });
    const messageErreur = { message: 'Login ou mot de passe incorrect' };
    if (!user) return res.status(401).json(messageErreur);

    // نقارنو الباسوورد المكتوب بالمشفّر
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json(messageErreur);

    res.json({ user, token: genererToken(user) });
  } catch (err) {
    next(err);
  }
};

exports.me = (req, res) => {
  res.json(req.user);
};