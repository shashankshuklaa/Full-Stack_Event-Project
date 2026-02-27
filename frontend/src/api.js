const API_BASE = "";

export const getUser = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/user`, {
      credentials: "include",
    });
    return await res.json();
  } catch (err) {
    console.error("Error fetching user:", err);
    return null;
  }
};

export const loginWithGoogle = () => {
  window.location.href = "/auth/google";
};

export const logout = () => {
  window.location.href = "/logout";
};
