import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllUsers, updateUser } from "../../redux/UsersSlice";
import store from "../../redux/store";
import { setLoader } from "../../redux/loaderSlice";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { toast } from "react-toastify";

const Users = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.users);

  const [status, setStatus] = useState(null);
  const [userId, setUserId] = useState(null);
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const handleUpdate = async () => {
    dispatch(setLoader(true));
    const response = await fetch(`/api/auth/update/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const user = await response.json();
    if (!response.ok) {
      toast.error("Status is not Updated!", {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      toast.success("User Updated Successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      dispatch(updateUser(user));
      setUserId(null);
    }
    dispatch(setLoader(false));
  };

  useEffect(() => {
    const fetchUsers = async () => {
      dispatch(setLoader(true));
      const response = await fetch("/api/auth/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      if (response.ok) {
        const json = await response.json();
        dispatch(setAllUsers(json));
        console.log(store.getState());
      }
      dispatch(setLoader(false));
    };
    if (users.length === 0) {
      fetchUsers();
    }
  }, [dispatch, auth]);

  return (
    <div className="w-full px-4 md:px-8">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 mb-6">
        {/* Role Filter */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="roleFilter"
            className="text-sm font-medium whitespace-nowrap"
          >
            Filter by Role:
          </label>
          <select
            id="roleFilter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm w-full sm:w-auto"
          >
            <option value="All">All</option>
            <option value="Client">Client</option>
            <option value="Caregiver">Caregiver</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="statusFilter"
            className="text-sm font-medium whitespace-nowrap"
          >
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm w-full sm:w-auto"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users &&
          users
            .filter((user) => user.role !== "Admin")
            .filter((user) =>
              roleFilter === "All" ? true : user.role === roleFilter
            )
            .filter((user) =>
              statusFilter === "All" ? true : user.status === statusFilter
            )
            .map((user) => (
              <div
                key={user._id}
                className="bg-white shadow-md rounded-xl p-4 border border-gray-200 flex flex-col justify-between"
              >
                {/* User Info */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {user.name}
                  </h2>
                  <p className="text-sm text-gray-600">{user.role}</p>
                  <p className="text-sm text-gray-600 break-words">
                    {user.email}
                  </p>
                </div>

                {/* Status */}
                <div className="mt-2">
                  <p className="text-sm">
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={`${
                        user.status === "Active"
                          ? "text-green-600"
                          : "text-red-600"
                      } font-semibold`}
                    >
                      {user.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Joined{" "}
                    {formatDistanceToNow(new Date(user.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <button
                    value={user.status === "Active" ? "Blocked" : "Active"}
                    onClick={(e) => {
                      setStatus(e.target.value);
                      setUserId(user._id);
                    }}
                    className={`px-3 py-1 text-xs text-white rounded transition-colors ${
                      user.status === "Active"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {user.status === "Active" ? "Block" : "Unblock"}
                  </button>

                  {user._id === userId && (
                    <button
                      className="px-3 py-1 text-xs text-white bg-blue-500 hover:bg-blue-600 rounded transition-colors"
                      onClick={handleUpdate}
                    >
                      Update
                    </button>
                  )}
                </div>
              </div>
            ))}
      </div>

      {/* No Users */}
      {(!users || users.length === 0) && (
        <div className="p-6 text-lg font-bold text-center text-gray-700">
          No users found.
        </div>
      )}
    </div>
  );
};

export default Users;
