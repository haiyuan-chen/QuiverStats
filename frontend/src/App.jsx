import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  // 1️⃣ Create a state variable "message", initially empty string
  const [message, setMessage] = useState('');

  // 2️⃣ After first render, fetch from our Flask API
  useEffect(() => {
    axios.get('/api/hello')              // thanks to the proxy
      .then(res => {
        // 2a. On success, store res.data.message in our state
        setMessage(res.data.message);
      })
      .catch(err => {
        // 2b. On error, log it so we can debug
        console.error('API call error:', err);
      });
  }, []);                                // [] means “run only once”

  // 3️⃣ Render the UI
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Message from backend:</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
