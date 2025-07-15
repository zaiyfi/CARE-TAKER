import { Button, Upload } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../../redux/loaderSlice";
import store from "../../../redux/store";
import { AiOutlineDelete } from "react-icons/ai";
import { BiErrorCircle } from "react-icons/bi";
import { setProductImage } from "../../../redux/productSlice";

const Images = ({ productId }) => {
  const { auth } = useSelector((state) => state.auth);
  const { products } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Calling Image Upload PATCH Api
  const imageUpload = async () => {
    dispatch(setLoader(true));
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(`/api/products/upload/${productId}`, {
      method: "PATCH",
      body: formData,
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    const json = await response.json();
    if (!response.ok) {
      console.log(json.error, "Response is not ok");
      dispatch(setLoader(false));
    }
    const img_url = json;
    if (response.ok) {
      dispatch(setLoader(false));
      dispatch(setProductImage({ img_url, productId }));
      console.log(store.getState());
    }
  };
  // Image Delete
  const ImageDelete = async (productID, imageIndex) => {
    dispatch(setLoader(true));
    const response = await fetch(
      `/products/deleteImage/${productID}/${imageIndex}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    const json = await response.json();

    if (!response.ok) {
      console.error(json.error, "Error while deleting image");
      setError(json.error);
    } else {
      console.log(json.message, "Image deleted successfully");
      dispatch(setLoader(false));
      setSuccess(json.message);
      store.getState();
    }

    dispatch(setLoader(false));
  };
  return (
    <div>
      {/* Displaying Error Popup*/}
      {error && (
        <div className="error-backend flex border-2 border-red-500 bg-white p-2 rounded">
          <BiErrorCircle className=" text-red-500 mx-1 text-lg mt-0.5" />
          <p className="text-black">{error}</p>
        </div>
      )}
      {success && (
        <div className="error-backend flex border-2 border-green-500 bg-white p-2 rounded">
          <BiErrorCircle className=" text-green-500 mx-1 text-lg mt-0.5" />
          <p className="text-black">{error}</p>
        </div>
      )}
      <Upload
        listType="picture"
        beforeUpload={() => false}
        onChange={(info) => setFile(info.file)}
      >
        <Button type="dashed">Upload Image</Button>
      </Upload>
      <div className="flex gap-5 mt-4">
        {products &&
          products?.map((product) => (
            <div key={product._id} className="flex gap-2 mb-4 ">
              {product._id === productId &&
                product.images?.map((image, index) => (
                  <div className="relative" key={index}>
                    <img
                      className="h-20 w-20 object-cover p-2 border border-solid border-neutral-800 rounded"
                      src={image}
                      alt=""
                    />
                    <AiOutlineDelete
                      className=" bottom-0 cursor-pointer"
                      onClick={() => ImageDelete(product._id, index)}
                    />
                  </div>
                ))}
            </div>
          ))}
      </div>
      <div className="flex justify-end gap-5 mt-5">
        <Button type="primary" onClick={imageUpload} disabled={!file}>
          Upload
        </Button>
      </div>
    </div>
  );
};

export default Images;
