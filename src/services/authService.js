const crypto = require("crypto");
const authRepository = require("../repositories/authRepository");

const SESSION_TTL_HOURS = Number(process.env.SESSION_TTL_HOURS || 8);

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  if (typeof storedHash !== "string") return false;

  const [salt, originalHash] = storedHash.split(":");
  if (!salt || !originalHash) return false;

  const hash = crypto.scryptSync(password, salt, 64).toString("hex");

  const originalBuffer = Buffer.from(originalHash, "hex");
  const hashBuffer = Buffer.from(hash, "hex");

  return originalBuffer.length === hashBuffer.length &&
    crypto.timingSafeEqual(originalBuffer, hashBuffer);
}

function login(username, password) {
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username.trim() ||
    !password
  ) {
    const error = new Error("Vui lòng nhập tên đăng nhập và mật khẩu.");
    error.status = 400;
    throw error;
  }

  const user = authRepository.getByUsername(username.trim());

  if (!user || !user.is_active || !verifyPassword(password, user.password_hash)) {
    const error = new Error("Tên đăng nhập hoặc mật khẩu không chính xác.");
    error.status = 401;
    throw error;
  }

  if (!Number.isFinite(SESSION_TTL_HOURS) || SESSION_TTL_HOURS <= 0) {
    throw new Error("SESSION_TTL_HOURS không hợp lệ.");
  }

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const expiresAt = new Date(
    Date.now() + SESSION_TTL_HOURS * 60 * 60 * 1000
  ).toISOString().replace("T", " ").slice(0, 19);

  authRepository.createSession(user.user_id, tokenHash, expiresAt);

  return {
    token,
    user: {
      user_id: user.user_id,
      username: user.username,
      role: user.role
    },
    expires_at: expiresAt
  };
}

function authenticate(token) {
  if (!token) return null;

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const session = authRepository.getSessionByTokenHash(tokenHash);

  if (!session) return null;

  return {
    user_id: session.user_id,
    username: session.username,
    role: session.role
  };
}

function logout(token) {
  if (!token) return false;

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  return authRepository.removeSession(tokenHash);
}

module.exports = {
  hashPassword,
  verifyPassword,
  login,
  authenticate,
  logout
};