import React from 'react';

const Dropdown = ({ label, options, selectedValue, onChange }) => (
  <div className="dropdown">
    <label>{label}</label>
    <select value={selectedValue} onChange={(e) => onChange(e.target.value)}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default Dropdown;