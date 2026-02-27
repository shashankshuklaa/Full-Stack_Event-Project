const API_BASE = "";

export const getUser = async () => {
  const res = await fetch(`${API_BASE}/api/user`, {
    credentials: "include",
  });
  return res.json();
};
fetch("/api/user",{
   credentials: "include"
})

export const loginWithGoogle = () => {
  window.location.href = "/auth/google";
};

export const logout = () => {
  window.location.href = "/logout";
};

