import { useEffect, useState } from "react";

// Redux Store and Hooks
import { useDispatch, useSelector } from "react-redux";
import { setAllUsers, updateUser } from "../../redux/UsersSlice";
import store from "../../redux/store";
import { setLoader } from "../../redux/loaderSlice";

// Other Modules
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { BiErrorCircle } from "react-icons/bi";
import { GrStatusGood } from "react-icons/gr";

const Users = () => {
  // Redux States
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.users);

  // useStates
  const [status, setStatus] = useState(null);
  const [userId, setUserId] = useState(null);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState(null);
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Updateing user Status
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
    console.log(user);
    if (!response.ok) {
      setError("Status is not Updated!");
      dispatch(setLoader(false));
    }
    if (response.ok) {
      setUpdated(true);
      dispatch(updateUser(user));
      dispatch(setLoader(false));
      setUserId(null);
      store.getState();
    }
  };

  //   Fetching all users data
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

  //   JSX start
  return (
    <div className="w-[75%]  me-[5%]">
      {updated && (
        <div className="error-backend flex border-2 border-green-500 bg-white p-2 rounded">
          <GrStatusGood className=" text-green-500 mx-1 text-lg mt-0.5" />
          <p className="text-black">User Updated Successfully!</p>
        </div>
      )}
      {error && (
        <div className="error-backend flex border-2 border-red-500 bg-white p-2 rounded">
          <BiErrorCircle className=" text-red-500 mx-1 text-lg mt-0.5" />
          <p className="text-black">{error}</p>
        </div>
      )}
      {/* Setting up the table to display users */}
      <div className="flex flex-col mx-4 overflow-hidden">
        {/*                                    Filters to display Users                  */}
        <div className="flex items-center gap-4 mb-4 px-4">
          <div className="flex items-center gap-4 mb-4 px-4">
            <label htmlFor="roleFilter" className="text-sm font-medium">
              Filter by Role:
            </label>
            <select
              id="roleFilter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="All">All</option>
              <option value="Client">Client</option>
              <option value="Caregiver">Caregiver</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="flex items-center gap-4 mb-4 px-4">
            <label htmlFor="statusFilter" className="text-sm font-medium">
              Filter by status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
        {/* USERS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-4 mt-4">
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
                  className="bg-white shadow-md rounded-xl p-4 border border-gray-200"
                >
                  <div className="mb-2">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {user.name}
                    </h2>
                    <p className="text-sm text-gray-600">{user.role}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="mb-2">
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
                  <div className="flex gap-2 mt-3">
                    <button
                      value={user.status === "Active" ? "Blocked" : "Active"}
                      onClick={(e) => {
                        setStatus(e.target.value);
                        setUserId(user._id);
                      }}
                      className={`px-3 py-1 text-xs text-white rounded ${
                        user.status === "Active"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {user.status === "Active" ? "Block" : "Unblock"}
                    </button>

                    {user._id === userId && (
                      <button
                        className="px-3 py-1 text-xs text-white bg-blue-500 hover:bg-blue-600 rounded"
                        onClick={handleUpdate}
                      >
                        Update
                      </button>
                    )}
                  </div>
                </div>
              ))}
        </div>

        {/* NO USERS FOUND */}
        {(!users || users.length === 0) && (
          <div className="p-6 text-lg font-bold text-center text-gray-700">
            No users found.
          </div>
        )}
      </div>
      {/* Table END */}
    </div>
  );
};

export default Users;
