const API_BASE = "";

export const getUser = async () => {
  const res = await fetch(`${API_BASE}/api/user`, {
    credentials: "include",
  });
  return res.json();
};

export const loginWithGoogle = () => {
  window.location.href = "/auth/google";
};

export const logout = () => {
  window.location.href = "/logout";
};
