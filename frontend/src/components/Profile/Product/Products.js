// filepath: c:\Users\Huzaifa\Documents\GitHub\CARE-TAKER\frontend\src\components\Profile\Product\Products.js
// importing Components and Modules
import { useState } from "react";

import GigForm from "./GigForm";
import GetLocation from "../../Others/GetLocation";
import ChatWindow from "../../Chat/ChatWindow"; // Importing the ChatWindow component

const Products = () => {
  // use States
  const [editForm, setEditForm] = useState(false);
  const [productId, setProductId] = useState(false);
  const [showChat, setShowChat] = useState(false); // State to manage chat visibility

  return (
    <div className="md:w-[100%]  md:me-[5%] ">
      {/* Showing the Product Form If user clicks on the upper Button */}
      <GigForm
        editForm={editForm}
        setEditForm={setEditForm}
        productId={productId}
      />
      <GetLocation />
      {/* Chat feature toggle button */}
      <button onClick={() => setShowChat(!showChat)}>
        {showChat ? "Hide Chat" : "Show Chat"}
      </button>
      {/* Conditionally rendering the ChatWindow */}
      {showChat && <ChatWindow />}
      {/* End */}
    </div>
  );
};

export default Products;
