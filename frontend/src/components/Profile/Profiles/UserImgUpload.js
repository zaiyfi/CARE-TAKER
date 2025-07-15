import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserPic } from "../../../redux/authSlice";
import { setLoader } from "../../../redux/loaderSlice";

const UserImgUpload = ({ auth }) => {
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();

  const handleFile = async () => {
    // Create FormData object and append the blob
    dispatch(setLoader(true));
    const formData = new FormData();
    formData.append("file", image);

    const res = await fetch(`/api/auth/image/upload/${auth.user._id}`, {
      method: "PATCH",
      body: formData,
      headers: {
        authorization: `Bearer ${auth.token}`,
      },
    });
    const userImg = await res.json();
    if (!res.ok) {
      console.log("response is not ok!");
      dispatch(setLoader(false));
    }
    if (res.ok) {
      console.log(userImg);
      dispatch(setUserPic(userImg));
      dispatch(setLoader(false));
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      {image && (
        <button
          className="bg-primary text-white p-2 mt-2 rounded-xl w-[100%]"
          onClick={handleFile}
        >
          Update
        </button>
      )}
    </div>
  );
};

export default UserImgUpload;
