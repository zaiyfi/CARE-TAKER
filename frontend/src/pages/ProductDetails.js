// React and Redux Hooks
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

// Other Modules
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import SellerDetails from "../components/SellerDetails";
import ProductInfo from "../components/Others/ProductInfo";
import ProductReviews from "../components/Others/ProductReviews";

const ProductDetails = () => {
  // Redux states
  const navigate = useNavigate();

  const { auth } = useSelector((state) => state.auth);
  const { gigs } = useSelector((state) => state.gigs);
  const dispatch = useDispatch();
  const { productId } = useParams();

  // handle chat
  const handleChat = async () => {
    const product = gigs.find((p) => p._id === productId);
    const sellerId = product.applicantId;

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
          },
        });
      } else {
        console.error("Failed to create chat:", data.message);
      }
    } catch (error) {
      console.error("Error creating chat:", error);
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
                    <SellerDetails seller={product.applicantId} />
                  ) : (
                    <p className="text-red-500">You are not logged in!</p>
                  )}

                  <ProductReviews
                    auth={auth}
                    reviews={product.reviews}
                    productId={product._id}
                  />

                  {auth?.user._id !== product.applicantId && (
                    <button
                      onClick={handleChat}
                      className="bg-primary text-white px-4 py-2 rounded-md hover:bg-lightPrimary transition"
                    >
                      Chat Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
    </div>
  );
};

export default ProductDetails;
