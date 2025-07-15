import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Importing Store and reducers
import store from "../.././redux/store";
import { setLoader } from "../.././redux/loaderSlice";
import { setProductStatus, updateGig } from "../.././redux/gigSlice";
import { useDispatch } from "react-redux";

const MappingRow = ({ product, auth }) => {
  const [productId, setProductId] = useState(false);
  const [status, setStatus] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Updating the status of the product through PATCH API
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
      console.log(json);
      if (!response.ok) {
        console.log("Failed to Update");
      }
      if (response.ok) {
        dispatch(updateGig(json));
        dispatch(setLoader(false));
        console.log(store.getState());

        setProductId(null);
      }
    } catch (error) {
      console.error("Error updating product status:", error);
      dispatch(setLoader(false));
      setProductId(null);
    }
  };
  return (
    <tbody key={product._id}>
      <tr className="border-b dark:border-neutral-500">
        <td className="whitespace-nowrap  px-6 py-4">
          {product.applicantName}
        </td>
        <td
          className="whitespace-nowrap  px-6 py-4 underline cursor-pointer"
          onClick={() => navigate(`/product/${product._id}`)}
        >
          {product.name}
        </td>

        <td className="whitespace-nowrap px-6 py-4">{product.status}</td>
        {/* Action Buttons */}
        <td className="whitespace-nowrap flex gap-1 px-6 py-4 justify-center ">
          {(product.status === "Blocked" || product.status === "Pending") && (
            <div>
              <button
                value="Approved"
                onClick={(e) => {
                  setStatus(e.target.value);
                  setProductId(product._id);
                }}
              >
                Approve
              </button>
              {product.status === "Pending" && (
                <button
                  className="ms-2"
                  value="Rejected"
                  onClick={(e) => {
                    setStatus(e.target.value);
                    setProductId(product._id);
                  }}
                >
                  Reject
                </button>
              )}
            </div>
          )}

          {product.status === "Approved" && (
            <button
              value="Blocked"
              onClick={(e) => {
                setStatus(e.target.value);
                setProductId(product._id);
              }}
            >
              Block
            </button>
          )}
          {product._id === productId && (
            <button onClick={() => updateStatus()} className="submit">
              Update
            </button>
          )}
        </td>
      </tr>
    </tbody>
  );
};

export default MappingRow;
