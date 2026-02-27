import React, { useEffect, useState } from "react";
import { getUser, loginWithGoogle, logout } from "./api";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUser();
      setUser(data);
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div style={{ padding: "40px" }}>Loading...</div>;
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Sydney Events</h1>

      {!user ? (
        <button onClick={loginWithGoogle}>Admin Login</button>
      ) : (
        <div>
          <p>Welcome, {user.display_name}</p>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;
