import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSelector } from "react-redux";

// Fix default icon (for your own location)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom icon for other users (e.g. green marker)
const otherUserIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const NearMeMap = () => {
  const [myLocation, setMyLocation] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const { auth } = useSelector((state) => state.auth);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setMyLocation(coords);

        // Send your location to backend and get nearby users
        const res = await fetch(`/api/auth/nearby`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(coords),
        });

        const data = await res.json();
        setNearbyUsers(data.users); // [{name, location}, ...]
        console.log(data);
      },
      (err) => {
        console.error("Geolocation error", err);
      }
    );
  }, []);

  return (
    <div>
      <h2>Caregivers Near You</h2>
      {myLocation && (
        <MapContainer
          center={[myLocation.latitude, myLocation.longitude]}
          zoom={13}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Your own location (default icon) */}
          <Marker position={[myLocation.latitude, myLocation.longitude]}>
            <Popup>You are here</Popup>
          </Marker>

          {/* Other users (custom icon) */}
          {nearbyUsers
            .filter((user) => user._id !== auth.user._id) // 👈 Filter out logged-in user
            .map((user, index) => (
              <Marker
                key={index}
                position={[
                  user.location.coordinates[1],
                  user.location.coordinates[0],
                ]}
                icon={otherUserIcon}
              >
                <Popup>
                  <strong>{user.name}</strong>
                  <br />
                  Role: {user.role}
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      )}
    </div>
  );
};

export default NearMeMap;
