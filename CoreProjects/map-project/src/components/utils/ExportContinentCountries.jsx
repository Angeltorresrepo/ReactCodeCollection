import { useEffect, useRef } from "react";
import countriesData from "../../utils/mapsJson/countries2.json";

/**
 * Devuelve true si la lon pertenece a Europa para el caso Rusia.
 * Regla simple: lon < 60 → Europa.
 */
const esEuropa = (lat, lon) => lon < 60;

/**
 * Asigna continente por lat/lon como fallback (igual que tu lógica original).
 */
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

const isSevenSeas = (v) =>
  typeof v === "string" && v.toLowerCase().includes("seven seas");

/**
 * Centroide aproximado del anillo exterior de un Polígono.
 * coords = [[lon, lat], ...]
 */
function centroidOfRing(coords) {
  let sx = 0, sy = 0;
  const n = coords.length;
  for (let i = 0; i < n; i++) {
    sx += coords[i][0];
    sy += coords[i][1];
  }
  return { lon: sx / n, lat: sy / n };
}

/**
 * Centroide aproximado de un Polígono (usa el anillo exterior)
 * poly = [ [ [lon,lat], ... ] , [hole...], ... ]
 */
function centroidOfPolygon(poly) {
  // anillo exterior:
  const outer = poly[0];
  return centroidOfRing(outer);
}

/**
 * Centroide aproximado de un MultiPolygon (media de centroides de cada polígono).
 * multipoly = [poly1, poly2, ...]
 */
function centroidOfMultiPolygon(multipoly) {
  let sx = 0, sy = 0, count = 0;
  for (const poly of multipoly) {
    const c = centroidOfPolygon(poly);
    sx += c.lon; sy += c.lat; count++;
  }
  return { lon: sx / count, lat: sy / count };
}

/**
 * Centroide aproximado de una geometría (Polygon o MultiPolygon).
 */
function centroidOfGeometry(geom) {
  if (!geom) return { lon: undefined, lat: undefined };
  if (geom.type === "Polygon") {
    return centroidOfPolygon(geom.coordinates);
  }
  if (geom.type === "MultiPolygon") {
    return centroidOfMultiPolygon(geom.coordinates);
  }
  return { lon: undefined, lat: undefined };
}

/**
 * Divide Rusia en dos Features: Europa y Asia, asignando cada polígono
 * según el centroide del polígono (lon < 60 → Europa).
 * Devuelve un array con 0, 1 o 2 features.
 */
function splitRussiaFeature(feature) {
  const geom = feature.geometry;
  if (!geom) return [];

  // Normalizamos a lista de polígonos:
  const polys = geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;

  const europePolys = [];
  const asiaPolys = [];

  for (const poly of polys) {
    const c = centroidOfPolygon(poly);
    if (esEuropa(c.lat, c.lon)) {
      europePolys.push(poly);
    } else {
      asiaPolys.push(poly);
    }
  }

  const result = [];

  if (europePolys.length) {
    const geomEU =
      europePolys.length > 1
        ? { type: "MultiPolygon", coordinates: europePolys }
        : { type: "Polygon", coordinates: europePolys[0] };
    result.push({
      type: "Feature",
      geometry: geomEU,
      properties: {
        ...feature.properties,
        CONTINENT: "Europe",
        NAME: "Russia (Europe)",
        ADM0_A3: "RUS_EU",
      },
    });
  }

  if (asiaPolys.length) {
    const geomAS =
      asiaPolys.length > 1
        ? { type: "MultiPolygon", coordinates: asiaPolys }
        : { type: "Polygon", coordinates: asiaPolys[0] };
    result.push({
      type: "Feature",
      geometry: geomAS,
      properties: {
        ...feature.properties,
        CONTINENT: "Asia",
        NAME: "Russia (Asia)",
        ADM0_A3: "RUS_AS",
      },
    });
  }

  return result;
}

function ExportContinentsCountries() {
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;          // Guard contra dobles ejecuciones
    done.current = true;

    const continents = {};             // { [continent]: Feature[] }

    for (const country of countriesData.features) {
      const code = country?.properties?.ADM0_A3;
      const props = country?.properties ?? {};
      let continent = props?.CONTINENT;

      // --- Manejo de Rusia: dividir geométricamente por polígonos ---
      if (code === "RUS") {
        const split = splitRussiaFeature(country);
        for (const part of split) {
          const cont = part.properties.CONTINENT;
          if (!continents[cont]) continents[cont] = [];
          continents[cont].push(part);
        }
        continue;
      }

      // --- Reasignación de "Seven seas" o faltante ---
      if (!continent || isSevenSeas(continent)) {
        // Preferimos calcular centroide geométrico si no hay lat/lon en props
        let lat = props.latitude;
        let lon = props.longitude;
        if (lat === undefined || lon === undefined) {
          const c = centroidOfGeometry(country.geometry);
          lat = c.lat; lon = c.lon;
        }
        continent = continentePorLatLon(lat, lon);
      }

      // Clonar feature con continente correcto (sin mutar el original)
      const featureCopy = {
        type: "Feature",
        geometry: country.geometry,
        properties: { ...props, CONTINENT: continent },
      };

      if (!continents[continent]) continents[continent] = [];
      continents[continent].push(featureCopy);
    }

    // Exportar un archivo por continente (una sola vez)
    Object.entries(continents).forEach(([continentName, features]) => {
      const geojson = {
        type: "FeatureCollection",
        features,
      };
      const jsonData = JSON.stringify(geojson, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      // Evita espacios problemáticos en nombres de archivo:
      const safeName = continentName.replace(/\s+/g, "_");
      link.download = `${safeName}.json`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }, []);

  return null;
}

export default ExportContinentsCountries;
