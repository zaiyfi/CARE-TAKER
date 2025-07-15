import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllUsers } from "../redux/UsersSlice";
import { Link } from "react-router-dom";
import store from "../redux/store";
import Button from "./Others/Button";

function SellerDetails({ seller }) {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const userLength = users?.length;
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`/api/auth/users`, {
        method: "GET",
      });
      const json = await response.json();
      dispatch(setAllUsers(json));
      console.log(store.getState());
    };
    if (!userLength > 0) {
      fetchUser();
    }
  }, [userLength, dispatch]);
  const user = userLength > 0 ? users?.find((u) => u._id === seller) : "null";
  const formatCellNumber = (cellNumber) => {
    return cellNumber.replace(/^(\d{2})(\d{3})/, "$1 $2 ");
  };

  return (
    <div>
      <h1 className=" ">Owner Details</h1>

      {user && (
        <div className="flex justify-between">
          <div>
            <p>Name</p>
            <p>Email</p>
            {user.cellNo && <p>Cell No</p>}
          </div>
          <div>
            <p>{user.name}</p>
            <p>{user.email}</p>
            {user.cellNo && <p>+{formatCellNumber(user.cellNo)}</p>}
          </div>
        </div>
      )}
      {/* Custom Made Button Component */}
      <Button link={`/seller/profile/${user._id}`} content="Seller Profile" />
    </div>
  );
}

export default SellerDetails;
