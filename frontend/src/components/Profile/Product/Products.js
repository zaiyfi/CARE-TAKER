// importing Components and Modules
import { useState } from "react";

import GigForm from "./GigForm";

const Products = () => {
  // use States
  const [editForm, setEditForm] = useState(false);
  const [productId, setProductId] = useState(false);

  // Redux

  // JSX
  return (
    <div className="md:w-[100%]  md:me-[5%] ">
      {/* Showing the Product Form If user clicks on the upper Button */}
      <GigForm
        editForm={editForm}
        setEditForm={setEditForm}
        productId={productId}
      />
      {/* End */}
    </div>
  );
};

export default Products;
