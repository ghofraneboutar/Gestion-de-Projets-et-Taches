const express = require('express');
const authRoutes = require('./src/auth/auth.routes');
const projectRoutes = require('./src/project/project.routes');
const taskRoutes = require('./src/task/task.routes');
const app = express();


app.use(express.json());

// route تجريبية
app.get('/', (req, res) => res.json({ message: 'API en marche' }));

app.use('/auth', authRoutes);
app.use('/project', projectRoutes);
app.use('/task', taskRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Erreur serveur' });
});

module.exports = app;