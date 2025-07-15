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
    dispatch(setLoader(true));
    const fetchUsers = async () => {
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
    fetchUsers();
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
        <div className="sm:-mx-6 lg:-mx-4">
          <div className="inline-block md:w-full py-2 sm:px-6 lg:px-8 ">
            <div className="overflow-hidden">
              <table className="min-w-full text-center text-sm font-light">
                <thead className="border-b font-medium  text-white dark:border-neutral-500 dark:bg-neutral-900">
                  <tr>
                    <th scope="col" className=" px-6 py-4">
                      Name
                    </th>
                    <th scope="col" className=" px-6 py-4">
                      Role
                    </th>
                    <th scope="col" className=" px-6 py-4">
                      Status
                    </th>
                    <th scope="col" className=" px-6 py-4">
                      Added
                    </th>
                    <th scope="col" className=" px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                {/* Displaying the Fetched users */}
                {users &&
                  users.length > 0 &&
                  users
                    .filter((user) => user.role !== "Admin")
                    .map((user) => (
                      <tbody key={user._id}>
                        <tr className="border-b dark:border-neutral-500">
                          <td className="whitespace-nowrap  px-6 py-4">
                            {user.name}
                          </td>

                          <td className="whitespace-nowrap  px-6 py-4">
                            {user.role}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {user.status}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {formatDistanceToNow(new Date(user.createdAt), {
                              addSuffix: true,
                            })}
                          </td>
                          <td className="whitespace-nowrap flex gap-1 px-6 py-4 justify-center ">
                            <button
                              value={
                                user.status === "Active" ? "Blocked" : "Active"
                              }
                              onClick={(e) => {
                                setStatus(e.target.value);
                                setUserId(user._id);
                              }}
                            >
                              {user.status === "Active" ? "Block" : "UnBlock"}
                            </button>

                            {user._id === userId && (
                              <button className="submit" onClick={handleUpdate}>
                                Update
                              </button>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    ))}
              </table>
              {!users && (
                <div className="r p-6 text-lg font-bold">
                  <h1 className="text-center">No users!</h1>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Table END */}
    </div>
  );
};

export default Users;
