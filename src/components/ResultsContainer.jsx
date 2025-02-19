import React from 'react';

const ResultsContainer = ({
  shellMinThickness,
  shellSelectedThickness,
  dishEndMinThickness,
  dishEndSelectedThickness,
  selectedDishEndType,
}) => (
  <div className="results-container">
    <h2>Results</h2>
    <div className="result-section">
      <h3>Shell Thickness</h3>
      <p>Minimum Shell Thickness: {shellMinThickness.toFixed(2)} mm</p>
      <p>Selected Shell Thickness: {shellSelectedThickness.toFixed(2)} mm</p>
    </div>
    <div className="result-section">
      <h3>{selectedDishEndType} Thickness</h3>
      <p>Minimum {selectedDishEndType} Thickness: {dishEndMinThickness.toFixed(2)} mm</p>
      <p>Selected {selectedDishEndType} Thickness: {dishEndSelectedThickness.toFixed(2)} mm</p>
    </div>
  </div>
);

export default ResultsContainer;