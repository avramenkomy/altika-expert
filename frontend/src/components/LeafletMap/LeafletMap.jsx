import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from 'react-leaflet';

import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import './LeafletMap.scss';


const markerIcon = L.divIcon({
  className: 'leaflet-map__marker-wrapper',
  html: `
    <div class="leaflet-map__marker">
      <div class="leaflet-map__marker-dot"></div>
    </div>
  `,
  iconSize: [36, 44],
  iconAnchor: [18, 44],
  popupAnchor: [0, -42],
});


function LeafletMap({
  latitude,
  longitude,
  title,
  address,
}) {
  if (!latitude || !longitude) {
    return (
      <div className="leaflet-map leaflet-map--empty">
        Координаты офиса не указаны
      </div>
    );
  }

  const position = [
    Number(latitude),
    Number(longitude),
  ];

  return (
    <div className="leaflet-map">
      <MapContainer
        center={position}
        zoom={16}
        scrollWheelZoom={false}
        className="leaflet-map__container"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={position}
          icon={markerIcon}
        >
          <Popup>
            <strong>{title}</strong>

            {address && (
              <>
                <br />
                {address}
              </>
            )}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default LeafletMap;
