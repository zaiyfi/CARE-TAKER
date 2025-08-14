const ProductInfo = ({ product }) => {
  return (
    <div className="">
      <h1 className="font-bold">About this Gig</h1>

      <div className="flex justify-between w-full">
        <div>
          <p>
            {" "}
            <strong>Recomended</strong>
          </p>
          <p>
            {" "}
            <strong>Experience</strong>
            <span>(years)</span>
          </p>
          <p>
            {" "}
            <strong>Price</strong>
            <span>(per day)</span>
          </p>{" "}
        </div>
        <div className="text-center">
          <p>
            {product.applicant.verificationStatus === "Approved"
              ? "Highly"
              : "Average"}
          </p>
          <p>{product.experience}</p> <p>Rs {product.hourlyRate}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
