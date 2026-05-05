// Generate 50 credential combos for stuffing
const credentials = [];
const baseNames = ['admin', 'root', 'user', 'test', 'guest', 'info', 'support', 'sales', 'alice', 'bob'];
const basePasswords = ['123456', 'password', 'qwerty', '12345678', '111111', '123456789', 'admin123', 'admin', 'welcome'];

for (let i = 0; i < 50; i++) {
  const name = baseNames[Math.floor(Math.random() * baseNames.length)] + Math.floor(Math.random() * 100);
  const pass = basePasswords[Math.floor(Math.random() * basePasswords.length)];
  credentials.push({ username: name, password: pass });
}

module.exports = credentials;
