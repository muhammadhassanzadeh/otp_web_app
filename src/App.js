// App.js
import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import './App.css';
import Settings from './Settings'; // Import the Settings component

function App() {
  const [clientNumber, setClientNumber] = useState('');
  const [bankName, setBankName] = useState('tejarat');
  const [mode, setMode] = useState('poll'); // Default to 'poll'
  const [callBack, setCallBack] = useState('');
  const [duration, setDuration] = useState('30');
  const [recordId, setRecordId] = useState('');
  const [message, setMessage] = useState('');
  const [pollingMessage, setPollingMessage] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // For detailed API error messages
  const [apiIP, setApiIP] = useState('172.25.20.60'); // New state for API IP address

  const flaskApiBaseUrl = `http://${apiIP}:8000`;

  useEffect(() => {
    let intervalId;

    if (recordId && duration > 0 && mode === 'poll') {
      intervalId = setInterval(() => {
        checkCallStatus();
      }, 1000);

      setTimeout(() => {
        clearInterval(intervalId);
      }, duration * 1000 + 3000);
    }

    return () => clearInterval(intervalId);
  }, [recordId, duration, mode]);

  const checkCallStatus = async () => {
    try {
      const response = await axios.get(`${flaskApiBaseUrl}/check-status/${recordId}`);
      setPollingMessage(`Status: ${response.data.status}`);
    } catch (error) {
      console.error('Error polling API', error);
      setPollingMessage('Error polling API');
    }
  };

  const handleSubmit = async () => {
    setButtonDisabled(true);
    setRecordId('');
    setPollingMessage('');
    setErrorMessage('');
    try {
      const payload = {
        client_number: clientNumber,
        client_bank_name: bankName,
        mode: mode,
        call_back: mode === 'push' ? callBack : '',
        duration: duration,
      };
      const response = await axios.post(`${flaskApiBaseUrl}/assign-number`, payload);
      setRecordId(response.data.record_id); 
      setMessage(`Assigned Number: ${response.data.assigned_number}, Record ID: ${response.data.record_id}`);
    } catch (error) {
      console.error('Error sending data to API', error);
      setMessage('Error sending data to API');
      setErrorMessage(error.response?.data?.detail || 'An unexpected error occurred');
    }
    setButtonDisabled(false);
  };


  return (
    <div className="App">
      <div className="background"></div>
      <img src="logo512.png" alt="React Logo" className="logo" />
      <div className="container">
        {/* Render the Client Number input on the main page */}
        <input
          type="text"
          style={{ width: '200px' }}
          placeholder="Client Number"
          value={clientNumber}
          onChange={(e) => setClientNumber(e.target.value)}
        />

        {/* Dropdown or settings panel for other inputs */}
        <details>
          <summary>Settings</summary>
          <Settings
            apiIP={apiIP}
            bankName={bankName}
            mode={mode}
            callBack={callBack}
            duration={duration}
            setApiIP={setApiIP}
            setBankName={setBankName}
            setMode={setMode}
            setCallBack={setCallBack}
            setDuration={setDuration}
          />
        </details>

        <button onClick={handleSubmit} disabled={buttonDisabled}>
          Request
        </button>
        {message && <div className="response">{message}</div>}
        {errorMessage && <div className="errorResponse">{errorMessage}</div>}
        {pollingMessage && (
          <div className="pollingResponse">{pollingMessage}</div>
        )}
      </div>
    </div>
  );
}
export default App;

