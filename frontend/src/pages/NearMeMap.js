import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Fix default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom icon for nearby users
const gigIcon = new L.Icon({
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
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setMyLocation(coords);

        try {
          const res = await fetch("/api/auth/nearby", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(coords),
          });

          const data = await res.json();
          setNearbyUsers(data.users);
        } catch (error) {
          console.error("Failed to fetch nearby users:", error);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
      }
    );
  }, []);

  const handleChat = async (sellerId, userName) => {
    try {
      const res = await fetch("http://localhost:4000/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ sellerId }),
      });

      const data = await res.json();
      if (res.ok) {
        navigate("/chat", {
          state: {
            chatId: data._id,
            sellerId,
            userName,
          },
        });
      } else {
        console.error("Failed to start chat:", data.message);
      }
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Nearby Caregivers
      </h2>

      {myLocation ? (
        <MapContainer
          center={[myLocation.latitude, myLocation.longitude]}
          zoom={13}
          style={{ height: "500px", width: "100%", borderRadius: "8px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Your location */}
          <Marker position={[myLocation.latitude, myLocation.longitude]}>
            <Popup>You are here</Popup>
          </Marker>

          {/* 5km circle */}
          <Circle
            center={[myLocation.latitude, myLocation.longitude]}
            radius={5000}
            pathOptions={{ color: "blue", fillOpacity: 0.1 }}
          />

          {/* Other users */}
          {nearbyUsers
            .filter((user) => user._id !== auth.user._id)
            .map((user) => (
              <Marker
                key={user._id}
                position={[
                  user.location.coordinates[1],
                  user.location.coordinates[0],
                ]}
                icon={gigIcon}
              >
                <Popup>
                  <div className="text-sm">
                    <strong>{user.name}</strong>
                    <br />
                    Role: {user.role}
                    <button
                      className="block mt-2 text-blue-600 hover:underline"
                      onClick={() => handleChat(user._id, user.name)}
                    >
                      Chat Now
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      ) : (
        <p className="text-gray-500">Getting your location...</p>
      )}
    </div>
  );
};

export default NearMeMap;
