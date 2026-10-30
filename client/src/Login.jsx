import { useState } from "react";
import { ShieldCheck, LockKeyhole, User, Eye, EyeOff } from "lucide-react";
import { authApi } from "./api/client";


export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authApi.login(username, password);
      onLogin(result.user);
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <ShieldCheck size={34} />
        </div>

        <div className="login-heading">
          <h1>MEKONG MOBILE</h1>
          <p>SMART CRM MANAGEMENT SYSTEM</p>
        </div>

        <div className="login-divider" />

        <h2>Đăng nhập hệ thống</h2>
        <p className="login-description">
          Vui lòng đăng nhập để tiếp tục quản lý bảo hành.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Tên đăng nhập</label>
          <div className="login-input">
            <User size={18} />
            <input
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <label>Mật khẩu</label>
          <div className="login-input">
            <LockKeyhole size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Hiện hoặc ẩn mật khẩu"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
          </button>
        </form>

        <div className="login-footer">
          © 2026 Smart CRM Mekong Mobile
        </div>
      </div>
    </div>
  );
}