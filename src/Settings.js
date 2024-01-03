// Settings.js
import React from 'react';


function Settings({
  apiIP,
  bankName,
  mode,
  callBack,
  duration,
  setApiIP,
  setBankName,
  setMode,
  setCallBack,
  setDuration,
}) {
  return (
    <div className="settings">
      <input
        type="text"
        placeholder="API IP Address"
        value={apiIP}
        onChange={(e) => setApiIP(e.target.value)}
      />
      <input
        type="text"
        placeholder="Bank Name"
        value={bankName}
        onChange={(e) => setBankName(e.target.value)}
      />
      <select value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="poll">Poll</option>
        <option value="push">Push</option>
      </select>
      {mode === 'push' && (
        <input
          type="text"
          placeholder="Call Back URL"
          value={callBack}
          onChange={(e) => setCallBack(e.target.value)}
        />
      )}
      <input
        type="number"
        placeholder="Duration (seconds)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
    </div>
  );
}

export default Settings;
