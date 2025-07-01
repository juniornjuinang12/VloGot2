const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401); // Si le token est absent

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Si le token est invalide

    req.user = user;
    next(); // Continuez avec l'utilisateur authentifié
  });
};

module.exports = authenticateToken; // Ajoute cette ligne pour exporter la fonction
