const ProductInfo = ({ product }) => {
  return (
    <div className="">
      <h1 className=" ">Product Details</h1>

      <div className="flex justify-between w-full">
        <div>
          <p>Recomended</p>
          <p>Experience</p>

          {product.location && <p>Location</p>}
          <p>Price</p>
        </div>
        <div className="text-center">
          <p>{product.experience > 3 ? "Highly" : "Not bad"}</p>
          <p>{product.experience}</p>

          <p>{product.location}</p>
          <p>$ {product.hourlyRate}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
