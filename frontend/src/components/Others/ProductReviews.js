import { useState } from "react";
import Button from "./Button";
import { IoStar, IoStarOutline } from "react-icons/io5";
import AddReview from "./AddReview";

const ProductReviews = ({ reviews, productId, auth }) => {
  const [addReview, setAddReview] = useState(false);
  return (
    <div>
      <h1 className="">Product Feedback</h1>
      <div className="my-2">
        {reviews.map((r, index) => (
          <div
            key={index}
            className={`${
              index !== reviews.length - 1 && " border-b-2 pb-2 mb-2"
            }  `}
          >
            <div className="flex items-center mb-2">
              <img
                src={r.user.pic}
                className="w-[40px] h-[40px] rounded-full object-cover"
                alt=""
              />
              <h2 className="ms-2 font-medium">{r.user.name}</h2>
              <div className="rating ms-4 flex">
                {[...Array(5)].map((star, index) => {
                  const currentRating = index + 1;
                  return (
                    <label>
                      <IoStar
                        className="start"
                        size={20}
                        color={
                          currentRating <= r.rating ? "#ffc107" : "#e4e5e9"
                        }
                      />
                    </label>
                  );
                })}
              </div>
            </div>
            <p>{r.comment}</p>
          </div>
        ))}
      </div>
      {addReview && (
        <AddReview
          IoStar={IoStar}
          productId={productId}
          setAddReview={setAddReview}
        />
      )}
            {/* Custom Made Button Component */}
      <Button content={auth ? `Add a review`: "Please Login First!"} bgColor={auth?`bg-primary`:` bg-secondary`} disable={auth? false:true} setAddReview={setAddReview} />
    </div>
  );
};

export default ProductReviews;
