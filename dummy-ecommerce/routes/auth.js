const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { protect, JWT_SECRET } = require('../lib/auth');

const usersPath = path.join(__dirname, '../data/users.json');
let users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '24h' });
};

router.post('/register', (req, res) => {
  const { name, email, password, address } = req.body;
  const userExists = users.find(u => u.email === email);

  if (userExists) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const newUser = {
    id: users.length + 1,
    name,
    email,
    passwordHash,
    role: 'customer',
    address,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  res.status(201).json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    token: generateToken(newUser.id, newUser.role)
  });
});

// Deliberate security gap: NO rate limiting on login
router.post('/login', (req, res) => {
  const { email, password, username } = req.body; // allow username too for the cred stuffer
  const loginField = email || username;
  
  const user = users.find(u => u.email === loginField || u.name === loginField);

  if (user && bcrypt.compareSync(password, user.passwordHash)) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role)
    });
  } else {
    res.status(401).json({ error: 'Invalid email or password' });
  }
});

router.post('/logout', (req, res) => {
  // Simple stub for logout
  res.json({ message: 'Logged out successfully' });
});

router.get('/me', protect, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const { passwordHash, ...safeUser } = user;
  res.json(safeUser);
});

module.exports = router;
