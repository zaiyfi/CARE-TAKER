// React and Redux Hooks
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setLoader } from "../redux/loaderSlice";
import { setProducts } from "../redux/gigSlice";

// Other Modules
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import store from "../redux/store";
import SellerDetails from "../components/SellerDetails";
import { setViewedProducts } from "../redux/authSlice";
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
        },
        body: JSON.stringify({
          userId: auth.user._id,
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

  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="product-details">
      <div className=" m-2">
        {gigs.length > 0 &&
          gigs
            .filter((product) => product._id === productId)
            .map((product) => (
              <div className="grid grid-cols-2 gap-5" key={product._id}>
                {/* Images  For    Product                                */}
                <div className="flex flex-col gap-2">
                  {product.image ? (
                    <img
                      src={product.image}
                      className="object-cover w-full h-96 rounded-md"
                      alt=""
                    />
                  ) : (
                    <h1 className=" mt-4 text-center text-2xl">
                      No Images Uploaded!
                    </h1>
                  )}
                  <div className="flex gap-5 mt-2 ">
                    {/* {product.images.map((image, index) => (
                      <div className="flex gap-5" key={index}>
                        <img
                          src={image}
                          className={`w-36 h-20 object-cover rounded-md cursor-pointer p-2 ${
                            selectedIndex === index
                              ? "border-2 border-primary"
                              : ""
                          }`}
                          onClick={() => setSelectedIndex(index)}
                          alt=""
                        />
                      </div>
                    ))} */}
                  </div>
                  <hr className="my-2" />
                  <div className="gap-0">
                    <h2 className="text-lg font-semibold">Added on</h2>
                    <p className="">
                      {formatDistanceToNow(new Date(product.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                {/* Product      Info                          */}
                <div className="flex flex-col gap-2" key={product._id}>
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                    <span>{product.description}</span>
                  </div>
                  <hr className="my-2" />
                  {/* Product      and       Owner      Details     */}
                  <div>
                    <ProductInfo product={product} />
                    <hr className="my-2" />

                    {/* Owner Details */}
                    {auth ? (
                      <SellerDetails seller={product.applicantId} />
                    ) : (
                      "You are not logged in!"
                    )}
                    <ProductReviews
                      auth={auth}
                      reviews={product.reviews}
                      productId={product._id}
                    />
                    {auth.user._id !== product.applicantId && (
                      <button
                        onClick={handleChat}
                        className=" bg-primary text-white p-2 rounded-md hover:bg-secondary"
                      >
                        Chat Now!
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default ProductDetails;
