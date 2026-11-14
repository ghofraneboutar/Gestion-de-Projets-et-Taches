const Project = require('./project.model');

exports.createProject = async (req, res, next) => {
  try {
    const { nom, description, statut } = req.body || {};

    if (!nom) {
      return res.status(400).json({ message: 'nom du projet requis' });
    }

    const project = await Project.create({
      nom, description, statut, owner: req.user._id
    });

    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};