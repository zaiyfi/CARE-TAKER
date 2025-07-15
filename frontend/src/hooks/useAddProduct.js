import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../redux/loaderSlice";

const useAddProduct = () => {
  const { auth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(false);

  const addProduct = async (productData) => {
    try {
      dispatch(setLoader(true));
      setError(null);
      const response = await fetch("/api/products/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(productData),
      });
      const json = await response.json();
      console.log(json);
      if (!response.ok) {
        throw new Error("Failed to add product");
      }
      setProduct(true);
      dispatch(setLoader(false));
    } catch (error) {
      setError(error.message);
      dispatch(setLoader(false));
    }
  };

  return { addProduct, error, product };
};

export default useAddProduct;
