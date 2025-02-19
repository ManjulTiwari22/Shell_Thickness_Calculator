import React, { useState } from 'react';
import InputField from './components/InputField';
import Dropdown from './components/Dropdown';
import ResultsContainer from './components/ResultsContainer';
import { calculateThickness, calculateDishEndThickness, interpolateStress } from './utils/calculations';
import { materialData } from './data/materialData';

const App = () => {
  const [pressure, setPressure] = useState('');
  const [diameter, setDiameter] = useState('');
  const [corrosionAllowance, setCorrosionAllowance] = useState('');
  const [efficiency, setEfficiency] = useState('');
  const [temperature, setTemperature] = useState('');
  const [selectedPressureUnit, setSelectedPressureUnit] = useState('MPa');
  const [selectedMaterial, setSelectedMaterial] = useState('IS 2062');
  const [selectedThinningAllowance, setSelectedThinningAllowance] = useState('18%');
  const [selectedDishEndType, setSelectedDishEndType] = useState('Hemispherical');
  const [shellMinThickness, setShellMinThickness] = useState(0.0);
  const [shellSelectedThickness, setShellSelectedThickness] = useState(0.0);
  const [dishEndMinThickness, setDishEndMinThickness] = useState(0.0);
  const [dishEndSelectedThickness, setDishEndSelectedThickness] = useState(0.0);

  const convertToMPa = (pressure, unit) => {
    switch (unit) {
      case 'Bar':
        return pressure * 0.1;
      case 'KPa':
        return pressure * 0.001;
      case 'Psi':
        return pressure * 0.00689476;
      case 'kgf/cm²':
        return pressure * 0.0980665;
      default:
        return pressure;
    }
  };

  const calculateThicknessHandler = () => {
    const pressureValue = parseFloat(pressure);
    const diameterValue = parseFloat(diameter);
    const corrosionAllowanceValue = parseFloat(corrosionAllowance);
    const efficiencyValue = parseFloat(efficiency);
    const temperatureValue = parseInt(temperature);

    if (!isNaN(pressureValue) {
      const pressureInMPa = convertToMPa(pressureValue, selectedPressureUnit);
      const stressMap = materialData.allowableStress[selectedMaterial];

      if (!stressMap) {
        alert('No data for the selected material.');
        return;
      }

      const allowableStress = interpolateStress({
        temperature: temperatureValue,
        stressMap: stressMap,
      });

      const thinningAllowance = selectedThinningAllowance === '18%' ? 1.18 : 1.10;
      const radius = diameterValue / 2;

      const shellResult = calculateThickness({
        pressure: pressureInMPa,
        radius: radius,
        corrosionAllowance: corrosionAllowanceValue,
        allowableStress: allowableStress,
        efficiency: efficiencyValue,
      });

      const shellMinThicknessValue = shellResult.calculated;
      const shellSelectedThicknessValue = shellResult.selected;

      const innerDiameter = diameterValue - 2 * corrosionAllowanceValue;
      const dishEndResult = calculateDishEndThickness({
        pressure: pressureInMPa,
        innerDiameter: innerDiameter,
        shellThickness: shellSelectedThicknessValue,
        allowableStress: allowableStress,
        efficiency: efficiencyValue,
        corrosionAllowance: corrosionAllowanceValue,
        thinningAllowance: thinningAllowance,
      });

      setShellMinThickness(shellMinThicknessValue);
      setShellSelectedThickness(shellSelectedThicknessValue);
      setDishEndMinThickness(dishEndResult[selectedDishEndType].calculated);
      setDishEndSelectedThickness(dishEndResult[selectedDishEndType].selected);
    }
  };

  return (
    <div className="app">
      <h1>Shell and Dish-End Thickness Calculator</h1>
      <div className="input-container">
        <div className="input-row">
          <InputField label="Design Pressure" value={pressure} onChange={setPressure} />
          <Dropdown
            label="Pressure Unit"
            options={['MPa', 'Bar', 'KPa', 'Psi', 'kgf/cm²']}
            selectedValue={selectedPressureUnit}
            onChange={setSelectedPressureUnit}
          />
        </div>
        <InputField label="Shell Inside Diameter (mm)" value={diameter} onChange={setDiameter} />
        <InputField label="Corrosion Allowance (mm)" value={corrosionAllowance} onChange={setCorrosionAllowance} />
        <InputField label="Joint Efficiency Factor (E) 1forfull&0.85forspot" value={efficiency} onChange={setEfficiency} />
        <InputField label="Design Temperature (°C)" value={temperature} onChange={setTemperature} />
        <Dropdown
          label="Dish-End Type"
          options={['Hemispherical', 'Torispherical', 'Ellipsoidal']}
          selectedValue={selectedDishEndType}
          onChange={setSelectedDishEndType}
        />
        <Dropdown
          label="Thinning Allowance"
          options={['18%', '10%']}
          selectedValue={selectedThinningAllowance}
          onChange={setSelectedThinningAllowance}
        />
        <Dropdown
          label="Material"
          options={Object.keys(materialData.allowableStress)}
          selectedValue={selectedMaterial}
          onChange={setSelectedMaterial}
        />
        <button onClick={calculateThicknessHandler}>Calculate Thickness</button>
      </div>
      <ResultsContainer
        shellMinThickness={shellMinThickness}
        shellSelectedThickness={shellSelectedThickness}
        dishEndMinThickness={dishEndMinThickness}
        dishEndSelectedThickness={dishEndSelectedThickness}
        selectedDishEndType={selectedDishEndType}
      />
    </div>
  );
};

export default App;