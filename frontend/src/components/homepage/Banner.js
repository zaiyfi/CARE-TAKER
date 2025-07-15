import React from "react";
import img from "./doctors.jpg";

function Banner() {
  return (
    <div className="banner">
      <div className="content">
        <h1>
          Stay <span className="text-primary">Connected</span> and Stay{" "}
          <span className="text-primary">Healthy</span>
        </h1>
      </div>
      <img src={img} className=" rounded-full" alt="" />
    </div>
  );
}

export default Banner;
