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
      className="col shadow-lg shadow-gray border-2  relative"
      key={product._id}
    >
      {/* Product Image */}
      <div className=" flex items-center justify-center relative w-full h-2/3">
        {product.image ? (
          <img
            src={product.image}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <h1 className="  text-xl text-black">No Images Uploaded!</h1>
        )}
      </div>{" "}
      {/* Product info */}
      <div className="content px-4 pt-2">
        <h2>{product.name}</h2>
        <p className=" text-xs font-light p-0">
          {formatDistanceToNow(new Date(product.createdAt), {
            addSuffix: true,
          })}
        </p>
        <h2
          className="cursor-pointer underline"
          onClick={() => ProductDetails()}
        >
          Gig Details
        </h2>
      </div>
    </div>
  );
}

export default HomeProductsMap;
