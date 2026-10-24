
const API_BASE_URL = "/api";

export async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      "Không kết nối được máy chủ. Hãy kiểm tra backend và thử lại."
    );
  }

  if (response.status === 401) {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-expired"));
    throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
  }

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(
      result.message || `Lỗi máy chủ: HTTP ${response.status}`
    );
  }

  return result.data;
}
