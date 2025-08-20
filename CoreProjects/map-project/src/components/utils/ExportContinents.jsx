
import { useRef, useEffect } from "react";
import provinciasData from '../../utils/mapsJson/provinces.json';
import countriesData from '../../utils/mapsJson/countries2.json';
import continentsData from '../../utils/mapsJson/continents.json'

function ExportContinents() {
  const provinces = provinciasData;
  const countries = countriesData;

  const continents = continentsData;

  const countryToContinent = {};
  countries.features.forEach(c => {
    countryToContinent[c.properties.ADM0_A3] = c.properties.CONTINENT;
  });

  const esEuropa = (lat, lon) => lon < 60;

  const continentePorLatLon = (lat, lon) => {
    if (lat === undefined || lon === undefined) return "Unknown";
    if (lat > 0) { // Hemisferio norte
      if (lon < -30) return "North America";
      if (lon < 60) return "Europe";
      return "Asia";
    } else { // Hemisferio sur
      if (lon < -30) return "South America";
      if (lon < 30) return "Africa";
      return "Oceania";
    }
  };

  // Recorrer provincias y asignar continente (temporalmente "Seven Seas" si no hay país)
  provinces.features.forEach(prov => {
    const countryCode = prov.properties["adm0_a3"];
    const lat = prov.properties["latitude"];
    const lon = prov.properties["longitude"];

    let continent;
    if (countryCode === "RUS") {
      continent = esEuropa(lat, lon) ? "Europe" : "Asia";
    } else if (!countryToContinent[countryCode]) {
      continent = "Seven Seas"; // temporal
    } else {
      continent = countryToContinent[countryCode];
    }

    if (!continents[continent]) continents[continent] = [];
    continents[continent].push(prov);
  });

 
  // Reasignar los que cayeron en "Seven Seas"
  if (continents["Seven seas (open ocean)"]) {
    console.log("Estoy mirando seven seas")
    
    const sevenSeasProvs = continents["Seven seas (open ocean)"];
    sevenSeasProvs.forEach(prov => {
      const lat = prov.properties["latitude"];
      const lon = prov.properties["longitude"];
      const newContinent = continentePorLatLon(lat, lon);

      if (!continents[newContinent]) continents[newContinent] = [];
      continents[newContinent].push(prov);
    });
    // Borrar la entrada temporal "Seven Seas"
    delete continents["Seven seas (open ocean)"];
  }

  Object.entries(continents).forEach(([continentName, provs]) => {
    provs.forEach(prov => {
      prov.properties.CONTINENT = continentName;
    });
  });

  useEffect(() => {
    const geojson = {
      type: "FeatureCollection",
      features: Object.values(continents).flat() 
    };
    const jsonData = JSON.stringify(geojson,null,2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Crear un link temporal y simular click
    const link = document.createElement("a");
    link.href = url;
    link.download = "continents.json";
    document.body.appendChild(link);
    link.click();

    // Limpiar
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [])

  return null;
  
}

export default ExportContinents.jsx;
