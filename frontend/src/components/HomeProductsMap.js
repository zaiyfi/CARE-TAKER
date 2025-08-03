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
  return (
    <div
      className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition cursor-pointer"
      onClick={ProductDetails}
    >
      {/* Image */}
      <div className="aspect-video bg-gray-100">
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
      <div className="p-4 space-y-1">
        <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
        <p className="text-xs text-gray-500">
          {formatDistanceToNow(new Date(product.createdAt), {
            addSuffix: true,
          })}
        </p>
        <p className="text-blue-600 text-sm hover:underline">View Gig</p>
      </div>
    </div>
  );
}

export default HomeProductsMap;
