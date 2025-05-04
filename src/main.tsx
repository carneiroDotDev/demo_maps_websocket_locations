import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "leaflet/dist/leaflet.css";
import App from "./App.tsx";
import { icon, Marker } from "leaflet";
import markerIcon2x from "./assets/marker-icon-2x.png";
import markerIcon from "./assets/marker-icon.png";
import markerShadow from "./assets/marker-shadow.png";

const iconDefault = icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

Marker.prototype.options.icon = iconDefault;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
