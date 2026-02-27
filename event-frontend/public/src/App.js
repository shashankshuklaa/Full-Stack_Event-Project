import React, { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

function App() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchEvents();
    checkLogin();
  }, []);

  const fetchEvents = async () => {
    const res = await axios.get("https://event-app-ilov.onrender.com");
    setEvents(res.data);
  };

  const checkLogin = async () => {
    try {
      const res = await axios.get("https://event-app-ilov.onrender.com");
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  const importEvent = async (id) => {
    await axios.post(
      `https://event-app-ilov.onrender.com`
    );
    fetchEvents();
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Sydney Events</h1>

      {!user ? (
        <a href="https://event-app-ilov.onrender.com">
          <button>Admin Login</button>
        </a>
      ) : (
        <p>Logged in as {user.email}</p>
      )}

      {events.map((event) => (
        <div key={event._id} style={{ marginBottom: "30px" }}>
          <h3>{event.title}</h3>
          <p>{new Date(event.date).toDateString()}</p>
          <p>{event.venue}</p>
          <p>Status: {event.status}</p>

          {user && event.status !== "imported" && (
            <button onClick={() => importEvent(event._id)}>
              Import
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;