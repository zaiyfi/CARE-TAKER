import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// Redux
import store from "../../../redux/store";
import { setLoader } from "../../../redux/loaderSlice";
import { updateGig } from "../../../redux/gigSlice";

const MappingCard = ({ product, auth }) => {
  const [productId, setProductId] = useState(null);
  const [status, setStatus] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const updateStatus = async () => {
    try {
      dispatch(setLoader(true));
      const response = await fetch(`/api/gigs/update/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ status }),
      });
      const json = await response.json();
      if (response.ok) {
        dispatch(updateGig(json));
      } else {
        console.log("Failed to update");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      dispatch(setLoader(false));
      setProductId(null);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md flex flex-col gap-2">
      <div>
        <h2 className="font-semibold text-gray-800 text-lg">
          {product.applicant.name}
        </h2>
        <p className="text-gray-800 cursor-pointer text-sm">
          <span className="text-sm text-gray-800 font-medium">Category:</span>{" "}
          {product.category}
        </p>
        <p
          onClick={() => navigate(`/product/${product._id}`)}
          className="text-blue-600 underline cursor-pointer text-sm"
        >
          {product.name}
        </p>
        {/* CV Link */}
        {product.cv && (
          <a
            href={product.cv}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 underline block mt-1"
          >
            View CV
          </a>
        )}
        <p className="text-sm mt-1">
          Status:{" "}
          <span
            className={`font-semibold ${
              product.status === "Approved"
                ? "text-green-600"
                : product.status === "Rejected"
                ? "text-red-600"
                : product.status === "Blocked"
                ? "text-yellow-500"
                : "text-gray-600"
            }`}
          >
            {product.status}
          </span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mt-2">
        {(product.status === "Blocked" || product.status === "Pending") && (
          <>
            <button
              value="Approved"
              onClick={(e) => {
                setStatus(e.target.value);
                setProductId(product._id);
              }}
              className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded"
            >
              Approve
            </button>
            {product.status === "Pending" && (
              <button
                value="Rejected"
                onClick={(e) => {
                  setStatus(e.target.value);
                  setProductId(product._id);
                }}
                className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
              >
                Reject
              </button>
            )}
          </>
        )}

        {product.status === "Approved" && (
          <button
            value="Blocked"
            onClick={(e) => {
              setStatus(e.target.value);
              setProductId(product._id);
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded"
          >
            Block
          </button>
        )}

        {product._id === productId && (
          <button
            onClick={updateStatus}
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded"
          >
            Update
          </button>
        )}
      </div>
    </div>
  );
};

export default MappingCard;
