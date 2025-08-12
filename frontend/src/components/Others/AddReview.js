import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setGigReview } from "../../redux/gigSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddReview = ({ IoStar, productId, setAddReview }) => {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");

  const { auth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const addReview = async () => {
    if (!rating || !comment.trim()) {
      toast.warning("Please provide a rating and comment.");
      return;
    }

    try {
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
        toast.success("Review added successfully!");
        setAddReview(false);
      } else {
        toast.error(json.message || "Error while adding review!");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="my-2">
      <div className="rating flex">
        {[...Array(5)].map((_, index) => {
          const currentRating = index + 1;
          return (
            <label key={currentRating}>
              <input
                type="radio"
                name="rating"
                value={currentRating}
                onClick={() => setRating(currentRating)}
                className="radio hidden"
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

      <textarea
        className="border-2 w-full p-2 mt-2 rounded"
        onChange={(e) => setComment(e.target.value)}
        value={comment}
        placeholder="Write your review..."
      />
      <button
        className="btn mt-2 bg-blue-500 text-white px-4 py-1 rounded"
        onClick={addReview}
      >
        Submit
      </button>
    </div>
  );
};

export default AddReview;
