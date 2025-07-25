import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../redux/loaderSlice";

const Verifications = () => {
  const dispatch = useDispatch();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { auth } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchPendingVerifications = async () => {
      dispatch(setLoader(true));
      try {
        const res = await fetch("/api/verify/pending", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setPendingUsers(data);
          dispatch(setLoader(false));
          console.log("Pending verifications fetched successfully:", data);
        } else {
          console.error("Error fetching verifications");
        }
      } catch (err) {
        dispatch(setLoader(false));
        console.error("Server error", err);
      } finally {
        setLoading(false);
      }
    };

    if (pendingUsers.length === 0) {
      fetchPendingVerifications();
    }
  }, [auth.token]);

  const handleApproval = async (verificationId, status) => {
    try {
      console.log(
        `Updating verification status for ID: ${verificationId} to ${status}`
      );
      dispatch(setLoader(true));
      const res = await fetch(`/api/verify/status/${verificationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ verificationStatus: status }),
      });

      const data = await res.json();
      if (res.ok) {
        setPendingUsers((prev) =>
          prev.filter((user) => user._id !== verificationId)
        );
        dispatch(setLoader(false));
        console.log(`Verification ${status} successfully:`, data);
      } else {
        console.error("Failed to update verification status");
        dispatch(setLoader(false));
      }
    } catch (err) {
      dispatch(setLoader(false));
      console.error("Error updating status", err);
    }
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">
        Pending Verifications
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : pendingUsers.length === 0 ? (
        <p>No users awaiting verification.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingUsers.map((v) => (
            <div
              key={v._id}
              className="border border-gray-200 rounded-xl p-4 shadow-md bg-white"
            >
              <div className="mb-2">
                <h2 className="text-lg font-bold text-gray-800">
                  {v.user.name}
                </h2>
                <p className="text-sm text-gray-600">{v.user.email}</p>
              </div>

              <div className="mb-2">
                <p className="text-sm text-gray-700 font-medium">
                  Status:{" "}
                  <span className="text-yellow-600 font-semibold">
                    {v.verificationStatus}
                  </span>
                </p>
              </div>

              <div className="mb-2">
                <p className="text-sm font-semibold mb-1">
                  Submitted Documents:
                </p>

                <div className="space-y-1">
                  <a
                    href={v.cnicFront}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-blue-600 text-sm underline hover:text-blue-800"
                  >
                    CNIC Front
                  </a>

                  <a
                    href={v.cnicBack}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-blue-600 text-sm underline hover:text-blue-800"
                  >
                    CNIC Back
                  </a>

                  <a
                    href={v.selfieWithCnic}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-blue-600 text-sm underline hover:text-blue-800"
                  >
                    Selfie with CNIC
                  </a>

                  {v.certificate && (
                    <a
                      href={v.certificate}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-blue-600 text-sm underline hover:text-blue-800"
                    >
                      Certificate (Optional)
                    </a>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleApproval(v._id, "Approved")}
                  className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleApproval(v._id, "Rejected")}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Verifications;
