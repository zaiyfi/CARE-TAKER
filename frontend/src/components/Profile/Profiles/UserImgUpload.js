import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserPic } from "../../../redux/authSlice";
import { setLoader } from "../../../redux/loaderSlice";
import { set } from "date-fns";

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
      setImage(null);
      return;
    }
    if (res.ok) {
      console.log(userImg);
      dispatch(setUserPic(userImg));
      dispatch(setLoader(false));
      setImage(null);
      return;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <input
        type="file"
        id="profile-pic"
        onChange={(e) => setImage(e.target.files[0])}
        className="hidden"
      />
      <label
        htmlFor="profile-pic"
        className="cursor-pointer inline-block px-4 py-2 bg-secondary text-white rounded hover:bg-lightPrimary text-sm"
      >
        Edit Profile Picture
      </label>

      {image && (
        <button
          className="bg-primary text-white p-2 mt-2 rounded-xl w-full max-w-[200px]"
          onClick={handleFile}
        >
          Update
        </button>
      )}
    </div>
  );
};

export default UserImgUpload;
