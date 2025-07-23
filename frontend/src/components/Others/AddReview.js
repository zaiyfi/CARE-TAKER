import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setGigReview } from "../../redux/gigSlice";

const AddReview = ({ IoStar, productId, setAddReview }) => {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState(null);

  const { auth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const addReview = async () => {
    console.log({ user: auth.user._id, comment, rating });
    const res = await fetch(`/api/gigs/addReview/${productId}`, {
      method: "PATCH",
      body: JSON.stringify({ user: auth.user._id, comment, rating }),
      headers: {
        authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();
    if (res.ok) {
      dispatch(setGigReview(json));
      console.log("review added!");
      setAddReview(false);
    } else {
      console.log("Error while adding review!");
    }
  };

  return (
    <div className="my-2">
      <div className="rating flex">
        {/* mapping 1 start 5 times for 5 star rating */}
        {[...Array(5)].map((star, index) => {
          const currentRating = index + 1;
          return (
            <label>
              <input
                type="radio"
                name="rating"
                value={currentRating}
                onClick={() => {
                  setRating(currentRating);
                }}
                className="radio"
                required
              />
              <IoStar
                className="star cursor-pointer"
                size={20}
                color={
                  currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9"
                }
                onMouseEnter={() => setHover(currentRating)}
                onMouseLeave={() => setHover(null)}
              />
            </label>
          );
        })}
      </div>

      <input
        type="textarea"
        className="border-2 w-[100%] p-2"
        onChange={(e) => setComment(e.target.value)}
        value={comment}
        required
      />
      <button className="btn mt-2" onClick={addReview}>
        Submit
      </button>
    </div>
  );
};

export default AddReview;
