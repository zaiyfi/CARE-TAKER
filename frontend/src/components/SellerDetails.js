import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllUsers } from "../redux/UsersSlice";
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
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Seller Details
      </h2>

      {user && (
        <div className="flex justify-between text-sm text-gray-700">
          <div className="space-y-1">
            <p className="font-medium">Name</p>
            <p className="font-medium">Email</p>
            {user.cellNo && <p className="font-medium">Cell No</p>}
          </div>
          <div className="text-right space-y-1">
            <p>{user.name}</p>
            <p>{user.email}</p>
            {user.cellNo && <p>+{formatCellNumber(user.cellNo)}</p>}
          </div>
        </div>
      )}

      <div className="mt-4">
        <Button
          link={`/seller/profile/${user._id}`}
          content="View Full Profile"
        />
      </div>
    </div>
  );
}

export default SellerDetails;
