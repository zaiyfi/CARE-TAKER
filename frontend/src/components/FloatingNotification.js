import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const FloatingNotification = () => {
  const { notif } = useSelector((state) => state.notif);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if the notif includes the word "success"
    if (notif.includes("success")) {
      setSuccess(true);
    } else {
      setSuccess(false);
    }
  }, [notif]);

  return (
    <div
      class={`error-backend ${
        success
          ? "bg-green-100 border-green-500 text-green-700"
          : "bg-red-100 border-red-500 text-red-700"
      } border-l-4  p-4`}
      role="alert"
    >
      <p class="font-bold">{success && "Success!"}</p>
      <p>{notif.includes("logged in") && "You logged in successfully!"}</p>
    </div>
  );
};

export default FloatingNotification;
