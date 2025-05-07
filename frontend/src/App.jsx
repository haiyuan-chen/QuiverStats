import { useEffect, useState } from "react";
import axios from "axios";
import TargetFace from "./components/TargetFace";

function App() {
  // 1️⃣ Create a state variable "message", initially empty string
  const [message, setMessage] = useState("");
  const [quivers, setQuivers] = useState([]);
  const [shots, setShots] = useState([]);
  const handleScore = (shot) => setShots((prev) => [...prev, shot]);

  useEffect(() => {
    axios
      .get("/api/quivers")
      .then((response) => {
        setQuivers(response.data);
      })
      .catch((error) => {
        console.error("Error loading quivers:", error);
      });
  }, []);

  // 2️⃣ After first render, fetch from our Flask API
  useEffect(() => {
    axios
      .get("/api/hello") // thanks to the proxy
      .then((res) => {
        // 2a. On success, store res.data.message in our state
        setMessage(res.data.message);
      })
      .catch((err) => {
        // 2b. On error, log it so we can debug
        console.error("API call error:", err);
      });
  }, []); // [] means “run only once”

  // 3️⃣ Render the UI
  return (
    <div style={{ width: "80vw", height: "80vh", margin: "auto" }}>
      <h1>Archery Target</h1>
      <TargetFace onScore={handleScore} shots={shots} />{" "}
      {/* using the export */}
      <h2>Scores</h2>
      <ul>
        {shots.map((s, i) => (
          <li key={i}>
            Arrow {i + 1}: {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
