const mongoose = require('mongoose');
const Task = require('./task.model');
const Project = require('../project/project.model');
const User = require('../user/user.model');

// pour verifier chkoun 3andou el 7a9 y7il el projet
const peutAccederProjet = (project, user) =>
  user.role === 'manager' || project.owner.equals(user._id);

exports.createTask = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    // Net2akdou eli ID mta3 el projet shih
    if (!mongoose.isValidObjectId(projectId)) {
      return res.status(400).json({ message: 'ID de projet invalide' });
    }

    //verification mta3 el projet
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Projet introuvable' });
    const { titre, description, statut, deadline } = req.body || {};
    if (!titre) return res.status(400).json({ message: 'titre requis' });
    const task = await Task.create({ titre, description, statut, deadline, project: projectId });
    res.status(201).json(task);
  } catch (err) { next(err); }
};

exports.getTasksByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    // Vérification mta3 ID
    if (!mongoose.isValidObjectId(projectId)) {
      return res.status(400).json({ message: 'ID de projet invalide' });
    }
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Projet introuvable' });

    // Nchoufou ken el user 3andou accès lel projet
    if (!peutAccederProjet(project, req.user)) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const { search, status, sort = 'createdAt', order = 'desc' } = req.query;
    const filter = { project: projectId };

    // Filtrage 7asb el statut
    if (status) {
      if (!['todo', 'doing', 'done'].includes(status)) {
        return res.status(400).json({ message: 'status doit être todo, doing ou done' });
      }
      filter.statut = status;
    }

    // Recherche 7asb titre mta3 el tâche
    if (search) {
      const motEchappe = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.titre = { $regex: motEchappe, $options: 'i' };
    }

    // N7adddou champ w sens mta3 tri
    const champsTri = ['deadline', 'createdAt', 'titre', 'statut'];
    const champ = champsTri.includes(sort) ? sort : 'createdAt';
    const sens = order === 'asc' ? 1 : -1;
    const tasks = await Task.find(filter).sort({ [champ]: sens });
    res.json(tasks);
  } catch (err) { next(err); }
};

// Fonction pour charger une tâche et vérifier l'accès
const chargerTache = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ message: 'ID invalide' });
    return null;
  }
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404).json({ message: 'Tâche introuvable' });
    return null;
  }

  // Njibou el projet w nchoufou ken el user propriétaire wala assigné lel tâche
  const project = await Project.findById(task.project);
  const estAssigne = task.assignedTo && task.assignedTo.equals(req.user._id);

  if (!(project && peutAccederProjet(project, req.user)) && !estAssigne) {
    res.status(403).json({ message: 'Accès refusé' });
    return null;
  }

  return task;
};

exports.getTask = async (req, res, next) => {
  try {
    const task = await chargerTache(req, res);
    if (task) res.json(task);
  } catch (err) { next(err); }
};

//modification mta3 el tâche
exports.updateTask = async (req, res, next) => {
  try {
    const task = await chargerTache(req, res);
    if (!task) return;

    // Na5dhou les nouvelles données
    const { titre, description, statut, deadline } = req.body || {};
    if (titre !== undefined) task.titre = titre;
    if (description !== undefined) task.description = description;
    if (statut !== undefined) task.statut = statut;
    if (deadline !== undefined) task.deadline = deadline;

    // Nsajlou les modifications
    await task.save();
    res.json(task);
  } catch (err) { next(err); }
};

//modification mta3 el tâche
exports.deleteTask = async (req, res, next) => {
  try {
    // Njibou el tâche w net2akdou mel accès
    const task = await chargerTache(req, res);
    if (!task) return;
    // Nfas5ou el tâche
    await task.deleteOne();
    res.json({ message: 'Tâche supprimée' });
  } catch (err) { next(err); }
};

// affectation mta3 el tâche lel utilisateur
exports.assignTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body || {};
    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'ID invalide' });
    }
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Tâche introuvable' });

    // Nlawjou 3al utilisateur elli bech na3mloulou affectation
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    // N3aynou el utilisateur lel tâche w nsajlou
    task.assignedTo = user._id;
    await task.save();
    res.json(task);
  } catch (err) { next(err); }
};