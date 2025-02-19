export const calculateThickness = ({
    pressure,
    radius,
    corrosionAllowance,
    allowableStress,
    efficiency,
  }) => {
    const standardThicknesses = [
      6, 8, 10, 12, 14, 16, 18, 20, 22, 25, 28, 30, 32, 36, 40, 45, 50,
      55, 60, 65, 70, 75, 80, 85, 90, 100, 110, 120, 130, 140, 150, 160,
      170, 180, 190, 200,
    ];
  
    const tMin = (pressure * radius) / (efficiency * allowableStress - 0.6 * pressure) + corrosionAllowance;
  
    let selectedThickness = standardThicknesses[standardThicknesses.length - 1];
    for (const thickness of standardThicknesses) {
      if (tMin <= thickness) {
        selectedThickness = thickness;
        break;
      }
    }
  
    return {
      calculated: tMin,
      selected: selectedThickness,
    };
  };
  
  export const calculateDishEndThickness = ({
    pressure,
    innerDiameter,
    shellThickness,
    allowableStress,
    efficiency,
    corrosionAllowance,
    thinningAllowance,
    k = 1.0,
  }) => {
    const radius = innerDiameter / 2;
  
    const tHem = (pressure * radius) / (2 * efficiency * allowableStress - 0.2 * pressure) + corrosionAllowance;
    const tHemWithThinning = tHem * thinningAllowance;
  
    const tTor = (pressure * innerDiameter) / (2 * efficiency * allowableStress * k - 0.2 * pressure) + corrosionAllowance;
    const tTorWithThinning = tTor * thinningAllowance;
  
    const tEll = (pressure * innerDiameter) / (2 * efficiency * allowableStress - 0.2 * pressure) + corrosionAllowance;
    const tEllWithThinning = tEll * thinningAllowance;
  
    const standardThicknesses = [
      6, 8, 10, 12, 14, 16, 18, 20, 22, 25, 28, 30, 32, 36, 40, 45, 50,
      55, 60, 65, 70, 75, 80, 85, 90, 100, 110, 120, 130, 140, 150, 160,
      170, 180, 190, 200,
    ];
  
    const selectNearestThickness = (tMin) => {
      for (const thickness of standardThicknesses) {
        if (tMin <= thickness) {
          return thickness;
        }
      }
      return standardThicknesses[standardThicknesses.length - 1];
    };
  
    return {
      Hemispherical: {
        calculated: tHemWithThinning < shellThickness ? shellThickness : tHemWithThinning,
        selected: selectNearestThickness(tHemWithThinning),
      },
      Torispherical: {
        calculated: tTorWithThinning < shellThickness ? shellThickness : tTorWithThinning,
        selected: selectNearestThickness(tTorWithThinning),
      },
      Ellipsoidal: {
        calculated: tEllWithThinning < shellThickness ? shellThickness : tEllWithThinning,
        selected: selectNearestThickness(tEllWithThinning),
      },
    };
  };
  
  export const interpolateStress = ({ temperature, stressMap }) => {
    const sortedTemps = Object.keys(stressMap).map(Number).sort((a, b) => a - b);
  
    for (let i = 0; i < sortedTemps.length - 1; i++) {
      const lowTemp = sortedTemps[i];
      const highTemp = sortedTemps[i + 1];
  
      if (lowTemp <= temperature && temperature <= highTemp) {
        const lowStress = stressMap[lowTemp];
        const highStress = stressMap[highTemp];
  
        return lowStress + ((temperature - lowTemp) / (highTemp - lowTemp)) * (highStress - lowStress);
      }
    }
  
    if (temperature < sortedTemps[0]) return stressMap[sortedTemps[0]];
    if (temperature > sortedTemps[sortedTemps.length - 1]) return stressMap[sortedTemps[sortedTemps.length - 1]];
  
    throw new Error('Temperature out of bounds.');
  };