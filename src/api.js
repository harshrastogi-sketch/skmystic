import { useNavigate } from "react-router-dom";

// 🔥 Main API helper
export const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
  });

  let data = {};

  try {
    data = await res.json();
  } catch (e) {
    data = {};
  }

  // 🔥 TOKEN EXPIRED / UNAUTHORIZED HANDLING
  if (
    res.status === 401 ||
    data.message === "Unauthorized" ||
    (data.message && data.message.toLowerCase().includes("expired"))
  ) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login"; // simple redirect
    return null;
  }

  return data;
};

export const verifyTokenRequest = (token) => {
  if (!token) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;

    // 🔥 TOKEN EXPIRED
    if (payload.exp < currentTime) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
      return null;
    }

    // ✅ VALID TOKEN
    return payload; // you can return true if you want
  } catch (e) {
    // 🔥 INVALID TOKEN FORMAT
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
    return null;
  }
};

export const getUser = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.data;
  } catch {
    return null;
  }
};
