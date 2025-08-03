// Redux Store and Reducers
import store from "../redux/store";
import { setLoader } from "../redux/loaderSlice";
import { setGigs } from "../redux/gigSlice";

// React/Redux/Router Hooks
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Other Modules
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import HomeProductsMap from "./HomeProductsMap";

const HomeProducts = () => {
  // Redux States
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { gigs } = useSelector((state) => state.gigs);

  const [filters, setFilters] = useState("All");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [searchQuery, setSearchQuery] = useState("");
  const [dynamicCat, setdynamicCat] = useState("");

  const navigate = useNavigate();

  // // Fetching Products
  useEffect(() => {
    dispatch(setLoader(false));
    // Fetching dynamic categories
    const dynamicCategory = async () => {
      const response = await fetch("/api/gigs/categories", {
        method: "GET",
      });
      const json = await response.json();

      console.log(json);
      setdynamicCat(json);
      console.log(dynamicCat);
    };
    dynamicCategory();

    if (!gigs?.length > 0) {
      const fetchProducts = async () => {
        dispatch(setLoader(true));
        console.log("Loader set to true");

        const response = await fetch("/api/gigs/get-gigs", {
          method: "GET",
        });
        const json = await response.json();
        if (!response.ok) {
          console.log("response is not ok");
          dispatch(setLoader(false));
        }
        if (response.ok) {
          console.log(json);
          dispatch(setGigs(json));
          dispatch(setLoader(false));
          console.log("Loader set to false");

          console.log(store.getState());
        }
      };
      fetchProducts();
    }
  }, [dispatch, auth]);

  // Search Query Filter
  const handleSearchQuery = (e) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
  };

  // Adding Filters
  const filteredProducts = gigs?.filter(
    (gig) =>
      (filters === "All" || gig.category === filters) &&
      gig.status === "Approved" &&
      gig.hourlyRate >= minPrice &&
      gig.hourlyRate <= maxPrice &&
      (searchQuery === "" ||
        (gig.name || gig.description)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))
  );
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <input
          type="search"
          className="w-full md:w-1/3 border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Search gigs..."
          onChange={handleSearchQuery}
        />

        <select className="w-full md:w-1/4 border border-gray-300 px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500">
          <option value="">Sort by: Newest</option>
          {/* Add real sorting options here if available */}
        </select>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters */}
        <aside className="lg:w-1/4 w-full">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Categories
            </h2>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(dynamicCat) &&
                ["All", ...dynamicCat].map((cat) => (
                  <button
                    key={cat}
                    value={cat}
                    onClick={(e) => setFilters(e.target.value)}
                    className={`px-4 py-1.5 rounded-full border text-sm transition ${
                      filters === cat
                        ? "bg-primary text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
            </div>
          </div>
        </aside>

        {/* Products */}
        <section className="lg:w-3/4 w-full">
          {filteredProducts?.length === 0 ? (
            <div className="flex justify-center items-center h-48 text-gray-500 text-lg">
              No Gigs Available
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((gig) => (
                <HomeProductsMap
                  key={gig._id}
                  product={gig}
                  user={auth?.user}
                  token={auth?.token}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomeProducts;
