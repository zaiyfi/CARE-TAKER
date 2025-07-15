import { useState } from "react";
import { Link } from "react-router-dom";

const Button = ({ link, content, setAddReview ,bgColor,disable}) => {
  const handleClick = () => {
    if (setAddReview) {
      setAddReview(true);
    }
  };
  return (
    <div className="flex justify-center w-[100%]">
      <Link to={link || ""} className="w-[50%] ">
        <button
          className={`${bgColor? bgColor:"bg-primary"} text-white py-2   hover:bg-secondary rounded-lg my-2 w-[100%]`}
          onClick={handleClick}
          disabled={disable? disable:false}
        >
          {content}
        </button>
      </Link>
    </div>
  );
};

export default Button;
