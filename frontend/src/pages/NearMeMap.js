import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Fix Leaflet default marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icon for current user
const userIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png", // a blue location icon
  iconSize: [32, 32], // size of the icon
  iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -32], // point from which the popup should open relative to the iconAnchor
});

export default function NearMeMap() {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation([lat, lng]);

        try {
          const { data } = await axios.post("/api/auth/nearby", {
            latitude: lat,
            longitude: lng,
          });
          console.log(data);
          setNearbyUsers(data.users || []);
        } catch (err) {
          toast.error("Failed to fetch nearby caregivers.");
          console.error("Error fetching nearby users:", err);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        toast.error(
          "Unable to fetch your location. Please refresh the page and allow location access."
        );
        setUserLocation([37.7749, -122.4194]);
      }
    );
  }, []);

  if (!userLocation) {
    return <p>Loading map...</p>;
  }

  return (
    <div style={{ height: "500px", position: "relative" }}>
      <MapContainer
        center={userLocation}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* User's own location with custom icon */}
        <Marker position={userLocation} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>

        {/* 5km radius circle */}
        <Circle
          center={userLocation}
          radius={5000}
          pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.1 }}
        />

        {/* Nearby caregivers */}
        {nearbyUsers.map((user, idx) => {
          const coords = user.location?.coordinates;
          if (!coords || coords.length < 2) return null;
          const [lng, lat] = coords;

          return (
            <Marker key={idx} position={[lat, lng]}>
              <Popup>
                <b>{user.name}</b>
                <br />
                Role: {user.role}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
