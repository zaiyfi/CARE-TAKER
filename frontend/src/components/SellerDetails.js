import { MdOutlineVerified } from "react-icons/md";

import { GoUnverified } from "react-icons/go";

function SellerDetails({ user }) {
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
            <p className="font-medium">Verification</p>
          </div>
          <div className="text-right space-y-1">
            <p>{user.name}</p>
            <p>{user.email}</p>
            {user.cellNo && <p>+{formatCellNumber(user.cellNo)}</p>}
            <div className="flex items-center justify-end">
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
      ${
        user.verificationStatus === "Approved"
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
              >
                {user.verificationStatus === "Approved" ? (
                  <>
                    <MdOutlineVerified className="text-base" />
                    Verified
                  </>
                ) : (
                  <>
                    <GoUnverified className="text-base" />
                    Not Verified
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerDetails;
