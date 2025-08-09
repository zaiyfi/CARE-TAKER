import formatDistanceToNow from "date-fns/formatDistanceToNow";

// Icons
import { useDispatch } from "react-redux";
import { setViewedProducts } from "../redux/authSlice";
import store from "../redux/store";
import { useNavigate } from "react-router-dom";

function HomeProductsMap({ product, user, token }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // product View
  const ProductDetails = () => {
    navigate(`/product/${product._id}`);
    if (user) {
      const addView = async () => {
        const response = await fetch(
          `/api/auth/viewGig/${product._id}/${user._id}`,
          {
            method: "PATCH",
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        const json = await response.json();
        console.log(json);
        if (!response.ok) {
          console.log("views REsponse is not Ok");
        }
        if (response.ok && !user.viewedProducts.includes(product._id)) {
          dispatch(setViewedProducts(product._id));
          console.log("product view added successfully!");
          console.log(store.getState());
        }
      };
      addView();
    }
  };
  const status = product?.applicant?.verificationStatus;
  return (
    <div
      className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition cursor-pointer"
      onClick={ProductDetails}
    >
      {/* Image */}
      <div className="relative aspect-video bg-gray-100">
        {status === "Approved" && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
            {status}
          </span>
        )}
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No Image Available
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>

        {/* Price */}
        <p className="text-primary font-bold">
          PKR {product.hourlyRate?.toLocaleString()}
        </p>

        {/* Reviews */}
        {Array.isArray(product.reviews) && product.reviews.length > 0 ? (
          <div className="flex items-center text-sm text-gray-600">
            <span className="text-yellow-500 mr-1">★</span>
            {(
              product.reviews.reduce((sum, r) => sum + r.rating, 0) /
              product.reviews.length
            ).toFixed(1)}{" "}
            <span className="ml-1 text-gray-500">
              ({product.reviews.length} review
              {product.reviews.length > 1 ? "s" : ""})
            </span>
          </div>
        ) : (
          <p className="text-xs text-gray-400">No reviews yet</p>
        )}

        {/* Time */}
        <p className="text-xs text-gray-500">
          {formatDistanceToNow(new Date(product.createdAt), {
            addSuffix: true,
          })}
        </p>

        {/* View Gig Button */}
        <button className="mt-2 px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-full shadow-sm hover:bg-lightPrimary transition-colors duration-200">
          View Gig
        </button>
      </div>
    </div>
  );
}

export default HomeProductsMap;
