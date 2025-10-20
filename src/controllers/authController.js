/**
 * Controlador de autenticación
 * Contiene la lógica para registrar y autenticar usuarios.
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '..', '..', 'data', 'users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'secret_example';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

/**
 * Leer usuarios desde archivo JSON (simple DB para la evidencia)
 */
function readUsers() {
  try {
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content || '[]');
  } catch (err) {
    return [];
  }
}

/**
 * Guardar usuarios en archivo JSON
 */
function writeUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

/**
 * registerUser - registra un nuevo usuario
 * Request body: { username, password }
 */
async function registerUser(req, res) {
  const { username, password } = req.body;

  // Validaciones básicas
  if (!username || !password) {
    return res.status(400).json({ error: 'Falta username o password' });
  }

  const users = readUsers();
  const exists = users.find(u => u.username === username);
  if (exists) {
    return res.status(409).json({ error: 'El usuario ya existe' });
  }

  try {
    // Hashear contraseña antes de guardar
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    const newUser = {
      id: uuidv4(),
      username,
      password: hashed,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsers(users);

    return res.status(201).json({ message: 'Registro exitoso', userId: newUser.id });
  } catch (err) {
    console.error('Error al registrar usuario', err);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}

/**
 * loginUser - autentica usuario
 * Request body: { username, password }
 */
async function loginUser(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Falta username o password' });
  }

  const users = readUsers();
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Autenticación fallida' });
  }

  try {
    // Comparar contraseñas con bcrypt
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ error: 'Autenticación fallida' });
    }

    // Generar token JWT simple
    const token = jwt.sign({ sub: user.id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({ message: 'Autenticación satisfactoria', token });
  } catch (err) {
    console.error('Error en login', err);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}

module.exports = { registerUser, loginUser };
