import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import { useRef, useEffect, useState } from "react";
import tinycolor from "tinycolor2";

import provinciasData from '../../utils/mapsJson/provinces.json';
import countriesData from '../../utils/mapsJson/countries2.json';
import continentsData from '../../utils/mapsJson/continents.json'

import africa from '../../utils/mapsJson/countries/Africa.json'
import asia from '../../utils/mapsJson/countries/Asia.json'
import europe from '../../utils/mapsJson/countries/Europe.json'
import northAmerica from '../../utils/mapsJson/countries/North_America.json'
import southAmerica from '../../utils/mapsJson/countries/South_America.json'
import oceania from '../../utils/mapsJson/countries/Oceania.json'

import MapRefSaver from "../MapRef/MapRefSaver";

import L from "leaflet";

import ExportContinents from "../utils/ExportContinents";
import ExportContinentsCountries from "../utils/ExportContinentCountries";


function MyMap() {
  const geoJsonData = {
    "Africa": africa,
    "Asia": asia,
    "Europe":europe,
    "North America": northAmerica,
    "South America": southAmerica,
    "Oceania": oceania
  }
  const provinces = provinciasData;
  const countries = countriesData;

  const continents = continentsData;
  const mapRef = useRef(null); 
  const popupRef = useRef(null);
  let isPopupActive = false;
  const  setPopupOpen = (boolean) => {
    isPopupActive = boolean;
  }

  const [landFeatures, setLandFeatures] = useState(continents);
  const [isHoverActive, setIsHoverActive] = useState(true);
  const [data, setData] = useState(null);
  
  
  const bounds = L.geoJSON(landFeatures).getBounds();
  const center = bounds.getCenter();
  const activeLayerRef = useRef(null);
  const continentLayersRef = useRef([]);

  const urlApi = "https://covid-api.com/api/reports/total?iso="

  useEffect(() => {
    if (mapRef.current && bounds.isValid()) {
      mapRef.current.fitBounds(bounds);
    }
  }, [bounds]);

  const defaultStyle = {
    color: "#555",
    weight: 1,
    fillOpacity: 0.5,
  };

  const insideStyle = {
    color: "#555",
    weight: 3,
    fillColor: "#51ff00ff",
    fillOpacity: 3,
  };

  const continentColors = {
    "Africa": "#84E3C8",
    "Europe": "#FFAAA5",
    "Asia": "#DCEDC1",
    "North America": "#A8E6CF",
    "South America": "#FFD3B6",
    "Oceania": "#FF8B94",
    "Antarctica": "#FF7480"
  };

  const preInitLayer = (layer) => {
    const path = layer.getElement();
    if (path) path.style.transform = "scale(1)";
  };
  const applyHoverEffect = (layer) => {
    if (!isHoverActive) return;
    const path = layer.getElement();
    if (path && isHoverActive) {
      requestAnimationFrame(() => {
        path.style.filter = "drop-shadow(0px 0px 10px rgba(0,0,0,0.5))";
        path.style.transform = "scale(1.05)";
        path.style.transformOrigin = "center center";
      });
    }
  };
  const onMouseOver = (e) => {
    if (!isHoverActive) return;
    const l = e.target;
    const originalColor = continentColors[l.feature.properties.CONTINENT] || "#ccc";
    if (activeLayerRef.current && activeLayerRef.current !== l) {
      const prevColor = continentColors[activeLayerRef.current.feature.properties.CONTINENT] || "#ccc";
      activeLayerRef.current.setStyle({
        ...defaultStyle,
        fillColor: prevColor
      });
      removeHoverEffect(activeLayerRef.current, true); 
    }
    l.setStyle(
      {
        ...insideStyle,
        fillColor:originalColor
      }
    );
    l.bringToFront();
    applyHoverEffect(l);
    activeLayerRef.current = l;
  };
  const onMouseOut = (e) => {
    if (!isHoverActive) return;
    const l = e.target;
    const originalColor = continentColors[l.feature.properties.CONTINENT] || "#ccc";
    l.setStyle({
      ...defaultStyle,
      fillColor: originalColor
    });
    removeHoverEffect(l);
    if (activeLayerRef.current === l) activeLayerRef.current = null;
  };
  const resetMap = () => {
    if (!mapRef.current) return;

    mapRef.current.scrollWheelZoom.disable();
    mapRef.current.dragging.disable();
    mapRef.current.doubleClickZoom.disable();
    mapRef.current.touchZoom.disable();
    mapRef.current.boxZoom.disable();
    mapRef.current.keyboard.disable();

    // Quita cualquier detalle
    if (detailLayer) {
      mapRef.current.removeLayer(detailLayer);
      detailLayer = null;
    }

    mapRef.current.fitBounds(bounds);

    continentLayersRef.current.forEach(layer => {
      const continentName = layer.feature.properties.CONTINENT;
      const color = continentColors[continentName] || "#ccc";

      // Restaurar estilo original
      layer.setStyle({
        ...defaultStyle,
        fillColor: color,
        fillOpacity: 0.5,
        weight: 1,
      });

      if (continentName !== "Antarctica") {
        enableInteractivity(layer);
      }

    });

    activeLayerRef.current = null;
  };
  const focusOnContinent = (continentName) => {
    let targetLayer = null;
    let zoom;
    let paddingVals = [140,140];
    let offsetLat = 0;
    let offsetLng = 0;

    continentLayersRef.current.forEach((layer) => {
      const isTarget = layer.feature.properties.CONTINENT === continentName;

      switch(continentName) {
        case 'North America':
            offsetLat = 10;
            offsetLng = 0;
            zoom = 3;
            //paddingVals = [350,50,50,50];
            break;
        case 'Europe':
            offsetLat = 5;
            offsetLng = 0;
            zoom = 3.5;
            break;
        case 'Asia':
            zoom = 2;
            break
        default:
            zoom = 4;
            break;
    }
      removeHoverEffect(layer, true);

      if (isTarget) {
        targetLayer = layer;
        layer.setStyle({ fillOpacity: 1, weight: 2 });
        layer.off("mouseover", onMouseOver);
        layer.off("mouseout", onMouseOut);
        const el = layer.getElement();
        if (el) {

          layer.setStyle({ fillOpacity: 0, weight: 0 });
          disableInteractivity(layer);
          el.classList.add("leaflet-interactive");
          el.style.pointerEvents = "auto";
          el.style.cursor = "default"; 
        }
      } else {
        layer.setStyle({ fillOpacity: 0, weight: 0 });
        disableInteractivity(layer);
      }
    });

    if (targetLayer && mapRef.current) {
      let mainBounds = getMainBounds(targetLayer);
      mainBounds = offsetBounds(mainBounds,offsetLat,offsetLng);
      const centerBounds = mainBounds.getCenter();

      mapRef.current.scrollWheelZoom.enable();
      mapRef.current.dragging.enable();
      mapRef.current.doubleClickZoom.enable();
      mapRef.current.touchZoom.enable();
      mapRef.current.boxZoom.enable();
      mapRef.current.keyboard.enable();

      mapRef.current.flyToBounds(mainBounds, {
        padding: paddingVals,
        maxZoom: zoom,
        animate: true,
      });

      mapRef.current.flyTo(mainBounds.getCenter(),zoom,{animate: true});



    }
  };
  function offsetBounds(bounds, offsetLat, offsetLng) {
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast(); 

    const newSw = L.latLng(sw.lat + offsetLat, sw.lng + offsetLng);
    const newNe = L.latLng(ne.lat + offsetLat, ne.lng + offsetLng); 

    return L.latLngBounds(newSw, newNe);
  }

  let detailLayer = null;
  const drawContinentDetail = (geojsonContinent) => {
    const map = mapRef.current;
    if (!map) return;

    if (detailLayer) {
      map.removeLayer(detailLayer);
      detailLayer = null;
    }

    const nameContinent = geojsonContinent.feature.properties.CONTINENT;
    const baseColor = continentColors[nameContinent];
    const darker = tinycolor(baseColor).darken(80).toString(); 
    const lighter = tinycolor(baseColor).lighten(2).toString(); 
    
    detailLayer = L.geoJSON(
      geoJsonData[nameContinent],
      {
        style: { fillColor: lighter, weight: 1, color: darker, fillOpacity: 0.7 },
        onEachFeature: (feature, layer) => {
          layer.on({
            mouseover: () => layer.setStyle({ fillOpacity: 1 }),
            mouseout: () => layer.setStyle({ fillOpacity: 0.7 }),
          });

           layer.on("click", onClickInfo);
        },
      }
    ).addTo(map);
  };


  const onClickInfo = (e) => {
    const layer = e.target;
    const code = layer.feature.properties["ADM0_A3"];
    const nameCountry = layer.feature.properties["BRK_NAME"]
    console.log(layer);
    const map = mapRef.current;
    let infoText;

    const { lat, lng } = e.latlng;

    fetch(urlApi + code)
    .then(res => res.json())
    .then(result => {
      if (result.data.length !== 0) {
        infoText = {
          "title": `COVID in ${nameCountry} (${code})`,
          "confirmed": `Confirmed: ${result.data.confirmed}`,
          "deaths": `Deaths: ${result.data.deaths}`,
          "rate": `Fatality rate:: ${(result.data.fatality_rate*100).toFixed(2)}%`

        }
      }else {
        infoText = {
          "title": `There is no data for ${nameCountry} ${code}`
        };
      }

      popupRef.current = infoText;
      isPopupActive = true;

      let content;

      if (infoText.confirmed) {
        // Caso con datos
        content = `
          <div>
            <h3>${infoText.title}</h3>
            <p class="confirmed">${infoText.confirmed}</p>
            <p class="deaths">${infoText.deaths}</p>
            <p class="rate">${infoText.rate}</p>
          </div>
        `;
      } else {
        // Caso sin datos
        content = `
          <div>
            <h3>${infoText.title}</h3>
          </div>
        `;
      }
      
      const popup = L.popup({className: "popup-container"})
        .setLatLng([lat, lng])
        .setContent(content)
        .openOn(map);

      setTimeout(() => {
        map.closePopup(popup);
      }, 3000);
    })
    .catch(err => console.error(err + " /// No data for this country."));
  }
  const onClick = (e) => {
    const layer = e.target;
    const path = layer.getElement();
    if (!path) return;

    path.style.transition = "transform 0.15s ease-in-out";
    path.style.transform = "scale(0.95)";

    setTimeout(() => {
        path.style.transform = "scale(1.05)";
        const continentName = layer.feature.properties.CONTINENT;
        drawContinentDetail(layer);
        focusOnContinent(continentName);
    }, 150);
  };
  const disableInteractivity = (layer) => {
    layer.off("mouseover", onMouseOver);
    layer.off("mouseout", onMouseOut);
    layer.off("click", onClick);
    const el = layer.getElement();
    if (el) {
      el.classList.remove("leaflet-interactive");
      el.style.pointerEvents = "none";
      el.style.cursor = "default";
    }
  };
  const enableInteractivity = (layer) => {
    layer.on("mouseover", onMouseOver);
    layer.on("mouseout", onMouseOut);
    layer.on("click", onClick);
    const el = layer.getElement();
    if (el) {
      el.classList.add("leaflet-interactive");
      el.style.pointerEvents = "auto";
      el.style.cursor = "pointer";
    }
  };
 const getMainBounds = (layer) => {
    if (!layer.getLatLngs) return layer.getBounds();

    const latlngs = layer.getLatLngs();
    // Estructuras posibles:
    // Polygon: [ [ringExterior], [holes...] ]
    // MultiPolygon: [ [ [ringExterior], [holes...] ], [ ... ], ... ]
    const polygons = [];

    const collectOuterRings = (arr) => {
      if (!Array.isArray(arr) || arr.length === 0) return;
      const first = arr[0];

      // Caso ring: array de LatLng
      if (first && first.lat !== undefined && first.lng !== undefined) {
        polygons.push(arr); // ya es un ring
        return;
      }

      // Caso Polygon: [ [LatLng...], [hole]... ]
      if (Array.isArray(first) && first[0] && first[0].lat !== undefined) {
        polygons.push(first); // primer anillo (outer)
        return;
      }

      // Caso MultiPolygon u otras profundidades: recursión
      arr.forEach(collectOuterRings);
    };

    collectOuterRings(latlngs);

    if (polygons.length === 0) return layer.getBounds();

    let best = null;
    let bestScore = -Infinity;
    polygons.forEach((ring) => {
      const b = L.latLngBounds(ring);
      const score = Math.abs((b.getNorth() - b.getSouth()) * (b.getEast() - b.getWest()));
      if (score > bestScore) {
        bestScore = score;
        best = b;
      }
    });

    return best || layer.getBounds();
  };
  const onEachContinent = (feature, layer) => {
  preInitLayer(layer);
  continentLayersRef.current.push(layer);

  if (feature.properties.CONTINENT === "Antarctica") {
    // Desactivar interactividad
    disableInteractivity(layer);
  } else {
    // Solo al resto les dejo eventos
    layer.on({ mouseover: onMouseOver, mouseout: onMouseOut, click: onClick });
  }
};


  const removeHoverEffect = (layer, instant = false) => {
    const path = layer.getElement();
    if (path) {
      if (instant) {
        path.style.transition = "none";
      } else {
        path.style.transition = "all 0.3s ease-in-out";
      }
      path.style.filter = "none";
      path.style.transform = "scale(1)";
    }
  };

  const handleMapCreated = (map) => {
    if (!isHoverActive) return;
    map.on("mouseout", () => {
      if (activeLayerRef.current) {
        const originalColor = continentColors[activeLayerRef.current.feature.properties.CONTINENT] || "#ccc";
        activeLayerRef.current.setStyle({
          ...defaultStyle,
          fillColor: originalColor
        });
        removeHoverEffect(activeLayerRef.current);
        activeLayerRef.current = null;
      }
    });
  };

  return (
    <>
      {/*<ExportContinents />*/}
      {/*<ExportContinentsCountries />*/}
      <MapContainer
        center={[center.lat, center.lng]}
        bounds={bounds}
        style={{ height: "100vh", width: "100%" }}
        zoom={1.3}
        zoomSnap={0}
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        dragging={false}
        touchZoom={false}
        boxZoom={false}
        keyboard={false}
        whenCreated={handleMapCreated}
      >
        <MapRefSaver mapRef={mapRef}/>
        <GeoJSON
          data={landFeatures}
          style={(feature) => ({ ...defaultStyle, transform: "scale(1)" , fillColor: continentColors[feature.properties.CONTINENT]})}
          onEachFeature={onEachContinent}
        />
      </MapContainer>
      <div style={{
        position: "fixed",  
        bottom: "20px",
        right: "20px",
        zIndex: 9999        
      }}>
        <button
          onClick={resetMap}
          style={{
            padding: "8px 12px",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "6px",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
          }}
        >
          Reset Map
        </button>
      </div>

    </>
    
  );
}

export default MyMap;
