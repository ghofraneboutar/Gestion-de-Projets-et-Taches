const mongoose = require('mongoose');
const Project = require('./project.model');
const Task = require('../task/task.model');


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

exports.getProjects = async (req, res, next) => {
  try {
    const { search, sort = 'createdAt', order = 'desc' } = req.query;

    // filter 5atir ken il  manager  ychouf tous les projets
    const filter = req.user.role === 'manager' ? {} : { owner: req.user._id };

    if (search) {
      const motEchappe = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.nom = { $regex: motEchappe, $options: 'i' };
    }
    const champsTri = ['nom', 'createdAt', 'statut'];
    const champ = champsTri.includes(sort) ? sort : 'createdAt';
    const sens = order === 'asc' ? 1 : -1;

    const projects = await Project.find(filter).sort({ [champ]: sens });
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

const chargerProjet = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ message: 'ID invalide' });
    return null;
  }
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404).json({ message: 'Projet introuvable' });
    return null;
  }
  const estProprietaire = project.owner.equals(req.user._id);
  if (!estProprietaire && req.user.role !== 'manager') {
    res.status(403).json({ message: 'Accès refusé' });
    return null;
  }
  return project;
};


exports.getProject = async (req, res, next) => {
  try {
    const project = await chargerProjet(req, res);
    if (project) res.json(project);
  } catch (err) { next(err); }
};

exports.updateProject = async (req, res, next) => {
  try {
    const project = await chargerProjet(req, res);
    if (!project) return;

    const { nom, description, statut } = req.body || {};
    if (nom !== undefined) project.nom = nom;
    if (description !== undefined) project.description = description;
    if (statut !== undefined) project.statut = statut; 

    await project.save();
    res.json(project);
  } catch (err) { next(err); }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await chargerProjet(req, res);
    if (!project) return;

    await Task.deleteMany({ project: project._id }); 
    await project.deleteOne();
    res.json({ message: 'Projet supprimé' });
  } catch (err) { next(err); }
};