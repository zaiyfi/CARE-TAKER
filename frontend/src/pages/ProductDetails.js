// React and Redux Hooks
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

// Other Modules
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import SellerDetails from "../components/SellerDetails";
import ProductInfo from "../components/Others/ProductInfo";
import ProductReviews from "../components/Others/ProductReviews";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import AppointmentPopup from "../components/AppointmentPopup";
import { fetchAppointments } from "../lib/helpers/getAppointments";
import { addAppointment } from "../redux/appointmentsSlice";

const ProductDetails = () => {
  // Redux states
  const navigate = useNavigate();

  const { auth } = useSelector((state) => state.auth);
  const { gigs } = useSelector((state) => state.gigs);
  const [showPopup, setShowPopup] = useState(false);

  const dispatch = useDispatch();
  const { productId } = useParams();

  // Get appointments from redux
  const { appointments } = useSelector((state) => state.appointment);

  // Get this product
  const currentProduct = gigs.find((product) => product._id === productId);

  // Check if appointment with this caregiver is already booked
  const existingAppointment = appointments.find(
    (a) =>
      a?.client?._id === auth?.user?._id &&
      a?.caregiver?._id === currentProduct?.applicant?._id &&
      ["Assigned", "Pending"].includes(a?.status)
  );

  useEffect(() => {
    if (auth?.token) {
      fetchAppointments(dispatch, auth.token);
    }
  }, [auth?.token]);

  // handle chat
  const handleChat = async () => {
    const product = gigs.find((p) => p._id === productId);
    const sellerId = product.applicant._id; // Use applicant._id instead of applicantId
    const sellerName = product.applicantName;

    try {
      const res = await fetch("http://localhost:4000/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
          // Include the token for authentication
        },
        body: JSON.stringify({
          sellerId: sellerId,
        }),
      });

      const data = await res.json();
      console.log("Chat data:", data);
      console.log(res.status);
      if (res.ok) {
        navigate("/chat", {
          state: {
            chatId: data._id, // ✅ valid chatId
            productId,
            sellerId,
            userName: sellerName, // Pass seller name for display
          },
        });
      } else {
        console.error("Failed to create chat:", data.message);
      }
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  // Sample data for caregivers, appointments, and client preferences
  const handleAppointmentSubmit = async (formData, clientId, caregiverId) => {
    try {
      const res = await fetch("http://localhost:4000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          ...formData,
          clientId,
          caregiverId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Appointment booked successfully!");
        setShowPopup(false);
        dispatch(addAppointment(data.appointment));
      } else {
        toast.error(data.message || "Failed to book appointment");
      }
    } catch (err) {
      console.error("Appointment error:", err);
      toast.error("An error occurred while booking appointment.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {gigs.length > 0 &&
        gigs
          .filter((product) => product._id === productId)
          .map((product) => (
            <div
              key={product._id}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Product Images & Date */}
              <div className="flex flex-col gap-4">
                {product.image ? (
                  <img
                    src={product.image}
                    className="w-full h-[400px] object-cover rounded-lg border"
                    alt={product.name}
                  />
                ) : (
                  <div className="flex items-center justify-center h-[400px] bg-gray-100 text-gray-500 rounded-lg border text-xl">
                    No Images Uploaded
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">Added</h3>
                  <p className="text-sm text-gray-600">
                    {formatDistanceToNow(new Date(product.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col gap-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  <p className="text-gray-700">{product.description}</p>
                </div>

                <div className="border-t pt-4 space-y-6">
                  <ProductInfo product={product} />
                  {/* Gig              Availability */}
                  {product.availability?.length > 0 && (
                    <div className="bg-gray-50 border rounded-lg p-4 shadow-sm">
                      <h2 className="text-lg font-semibold text-gray-800 mb-2">
                        Availability
                      </h2>
                      <ul className="space-y-2">
                        {product.availability.map((slot) => (
                          <li
                            key={slot._id}
                            className="flex justify-between items-center text-gray-700 border-b last:border-b-0 pb-2"
                          >
                            <span className="font-medium">{slot.day}</span>
                            <span className="text-sm text-gray-600">
                              {slot.startTime} — {slot.endTime}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {auth ? (
                    <SellerDetails
                      seller={product.applicant._id}
                      user={product.applicant}
                    />
                  ) : (
                    <p className="text-red-500">You are not logged in!</p>
                  )}

                  <ProductReviews
                    auth={auth}
                    reviews={product.reviews}
                    productId={product._id}
                    applicant={product.applicant}
                    appointments={appointments}
                  />

                  {auth?.user._id !== product.applicant._id &&
                    auth?.user.role !== "Admin" && (
                      <div className="flex gap-4">
                        <button
                          onClick={handleChat}
                          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-lightPrimary transition"
                        >
                          Chat Now
                        </button>

                        {existingAppointment ? (
                          <button
                            disabled
                            className="bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed"
                          >
                            Appointment Already Booked
                          </button>
                        ) : (
                          <button
                            onClick={() => setShowPopup(true)}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                          >
                            Book Appointment
                          </button>
                        )}
                      </div>
                    )}

                  {/* ✅ Render Appointment Popup */}
                  {showPopup && (
                    <AppointmentPopup
                      availability={product.availability}
                      onClose={() => setShowPopup(false)}
                      category={product.category}
                      onSubmit={(formData) =>
                        handleAppointmentSubmit(
                          formData,
                          auth.user._id,
                          product.applicant._id
                        )
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
    </div>
  );
};

export default ProductDetails;
