import React from 'react';

const InputField = ({ label, value, onChange }) => (
  <div className="input-field">
    <label>{label}</label>
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

export default InputField;