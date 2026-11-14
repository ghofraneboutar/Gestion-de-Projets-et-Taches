# Gestion de Projets et Tâches : API REST

API REST permettant à des utilisateurs authentifiés de gérer leurs projets et les tâches associées.

## Auteur

- **Ghofrane boutar** : Master ISIDS

## Technologies

- Node.js, Express
- MongoDB, Mongoose
- JWT (jsonwebtoken), bcryptjs
- dotenv, nodemon

## Fonctionnalités

- Authentification JWT et rôles (`user`, `manager`)
- Gestion des projets (CRUD, recherche, tri)
- Gestion des tâches rattachées à un projet (CRUD, recherche, filtre, tri)
- Affectation d'une tâche à un utilisateur (réservée au manager)
- Routes protégées par des middlewares

## Règles métier

- Tout utilisateur authentifié (user ou manager) peut créer un projet.
- Un `user` voit uniquement ses projets ; seul le `manager` voit tous les projets.
- Chaque tâche est liée à un projet et peut être créée par tout utilisateur authentifié.
- Le statut d'une tâche est limité à `todo`, `doing` ou `done`.
- Seul le `manager` peut affecter une tâche à un utilisateur.

## Installation

```bash
git clone <URL_DU_REPO>
cd Gestion-de-Projets-et-Taches
npm install
```


## Structure du projet

```
├── app.js                  configuration Express et routes
├── server.js               connexion MongoDB et démarrage
└── src/
    ├── config/db.js
    ├── auth/               inscription, connexion, middlewares
    ├── user/               modèle User
    ├── project/            modèle, contrôleur, routes des projets
    ├── task/               modèle, contrôleur, routes des tâches
    └── middleware/         errorHandler
```

