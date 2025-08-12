import { useState } from "react";
import Button from "./Button";
import { IoStar, IoStarOutline } from "react-icons/io5";
import AddReview from "./AddReview";
import { useSelector } from "react-redux";

const ProductReviews = ({
  reviews,
  applicant,
  productId,
  auth,
  appointments,
}) => {
  const [addReview, setAddReview] = useState(false);

  const userId = auth?.user?._id;
  const isCaregiver = auth?.user?.role === "Caregiver";

  // Check if user has completed appointment with this caregiver
  const hasCompletedAppointment = appointments?.some(
    (appt) =>
      appt.client._id === userId &&
      appt.caregiver._id === applicant._id && // Assuming productId = caregiverId
      appt.status === "Completed"
  );

  const canReview = auth && !isCaregiver && hasCompletedAppointment;

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm mt-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Gig Feedback</h2>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-500">
            No reviews yet. Be the first to leave feedback!
          </p>
        ) : (
          reviews.map((r, index) => (
            <div
              key={index}
              className={`${
                index !== reviews.length - 1 ? "border-b pb-4" : ""
              }`}
            >
              <div className="flex items-center mb-2">
                <img
                  src={r.user.pic}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div className="ml-3">
                  <h3 className="font-medium text-sm text-gray-800">
                    {r.user.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => {
                      const current = i + 1;
                      return (
                        <IoStar
                          key={i}
                          size={16}
                          color={current <= r.rating ? "#fbbf24" : "#e5e7eb"}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700">{r.comment}</p>
            </div>
          ))
        )}
      </div>

      {addReview && (
        <div className="mt-4">
          <AddReview
            IoStar={IoStar}
            productId={productId}
            setAddReview={setAddReview}
          />
        </div>
      )}

      <div className="mt-4">
        <Button
          content={auth ? "Add a review" : "Please Login First"}
          bgColor={canReview ? "bg-primary" : "bg-gray-300"}
          disable={!canReview}
          setAddReview={setAddReview}
        />
        {!canReview && (
          <p className="text-sm text-red-500 mt-2">
            You can only leave a review after completing an appointment with
            this caregiver.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
