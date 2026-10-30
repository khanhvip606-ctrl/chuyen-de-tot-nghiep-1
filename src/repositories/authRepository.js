const db = require("../database/db");

const findByUsername = db.prepare(`
  SELECT user_id, username, password_hash, role, is_active
  FROM users
  WHERE username = ?
`);

const insertUser = db.prepare(`
  INSERT INTO users (username, password_hash, role)
  VALUES (?, ?, ?)
`);

const insertSession = db.prepare(`
  INSERT INTO auth_sessions (user_id, token_hash, expires_at)
  VALUES (?, ?, ?)
`);

const findSession = db.prepare(`
  SELECT
    auth_sessions.session_id,
    auth_sessions.user_id,
    auth_sessions.expires_at,
    users.username,
    users.role,
    users.is_active
  FROM auth_sessions
  JOIN users ON users.user_id = auth_sessions.user_id
  WHERE auth_sessions.token_hash = ?
    AND auth_sessions.expires_at > datetime('now')
    AND users.is_active = 1
`);

const deleteSession = db.prepare(`
  DELETE FROM auth_sessions
  WHERE token_hash = ?
`);

const deleteExpiredSessions = db.prepare(`
  DELETE FROM auth_sessions
  WHERE expires_at <= datetime('now')
`);

function getByUsername(username) {
  return findByUsername.get(username);
}

function createUser(username, passwordHash, role = "STAFF") {
  return insertUser.run(username, passwordHash, role);
}

function createSession(userId, tokenHash, expiresAt) {
  return insertSession.run(userId, tokenHash, expiresAt);
}

function getSessionByTokenHash(tokenHash) {
  return findSession.get(tokenHash);
}

function removeSession(tokenHash) {
  return deleteSession.run(tokenHash).changes > 0;
}

function removeExpiredSessions() {
  return deleteExpiredSessions.run().changes;
}

module.exports = {
  getByUsername,
  createUser,
  createSession,
  getSessionByTokenHash,
  removeSession,
  removeExpiredSessions
};