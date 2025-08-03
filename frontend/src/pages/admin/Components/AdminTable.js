import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../../redux/loaderSlice";
import { setGigs } from "../../../redux/gigSlice";
import store from "../../../redux/store";
import { useEffect } from "react";
import MappingCard from "./MappingCard";

const AdminTable = () => {
  const { gigs } = useSelector((state) => state.gigs);
  const { auth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Fetching The Products
  useEffect(() => {
    if (!gigs.length > 0) {
      const fetchProducts = async () => {
        dispatch(setLoader(true));

        try {
          const response = await fetch("/api/gigs/get-gigs", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          });
          const json = await response.json();
          if (!response.ok) {
            console.log("response is not ok");
            dispatch(setLoader(false));
          }
          dispatch(setGigs(json));
          dispatch(setLoader(false));
          console.log(store.getState());
        } catch (error) {
          dispatch(setLoader(false));
        }

        dispatch(setLoader(false));
      };
      fetchProducts();
    }
  }, [dispatch, auth]);

  return (
    <div>
      {/* Setting up the table to display Products */}
      <div className="w-[100%]  flex flex-col">
        <div className="sm:-mx-6 lg:-mx-4">
          <div className="inline-block md:w-full py-2 sm:px-6 lg:px-8 ">
            {/* GIG CARDS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
              {gigs &&
                gigs.length > 0 &&
                gigs.map((gig) => (
                  <MappingCard key={gig._id} product={gig} auth={auth} />
                ))}

              {(!gigs || gigs.length === 0) && (
                <div className="p-6 text-lg font-bold text-center text-gray-700">
                  No Gigs!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTable;
