const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, '../data/users.json');
let users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));

// Deliberate security gap: /api/users has NO auth check
router.get('/', (req, res) => {
  res.json(users);
});

// Deliberate security gap: No ownership check
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Deliberate security gap: No ownership check for updates
router.put('/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
    res.json(users[index]);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Deliberate security gap: No auth check at all for deletion
router.delete('/:id', (req, res) => {
  users = users.filter(u => u.id !== parseInt(req.params.id));
  res.json({ message: 'User deleted' });
});

module.exports = router;
