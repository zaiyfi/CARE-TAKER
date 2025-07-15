// Redux Store and Reducers
import store from "../redux/store";
import { setLoader } from "../redux/loaderSlice";
import { setGigs } from "../redux/gigSlice";

// React/Redux/Router Hooks
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

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

  // // Fetching Products
  useEffect(() => {
    dispatch(setLoader(false));

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
  console.log(filteredProducts);
  return (
    <div>
      {/* Product Details header items */}
      <div className="flex w-full justify-between my-4 items-center">
        <div className="flex justify-between w-3/12 items-center">
          <input
            type="search"
            className=" border-2 border-gray-500 outline-none p-1"
            placeholder="Search..."
            onChange={handleSearchQuery}
          />
          <BsFillGrid3X3GapFill className=" border-2 border-gray-500 text-xl" />
        </div>
        <p className="f font-normal">
          <span className="f font-basic">{filteredProducts?.length}</span>{" "}
          {filteredProducts?.length > 1 ? "Products" : "Product"} Available
        </p>
        <select className=" border-2 border-gray-500 outline-none p-1 cursor-pointer">
          <option value="">Products (Newest to Oldest)</option>
        </select>
      </div>
      <div className="flex gap-2 w-[100%]">
        {/* Filters */}
        <div className="sidebar p-2 pt-6 pb-10 md:w-2/12 ">
          <h1 className="text-xl w-1/3 border-b-primary border-b-2 mb-2">
            Filters
          </h1>
          {/* Category Filters */}
          <h1 className="text-lg text-black ">Category</h1>
          <div className="buttons">
            <button
              value="All"
              onClick={(e) => setFilters(e.target.value)}
              className={filters === "All" && "fil-css"}
            >
              All
            </button>
            <button
              value="Vehicle"
              onClick={(e) => setFilters(e.target.value)}
              className={filters === "Vehicle" && "fil-css"}
            >
              Vehicles
            </button>
            <button
              value="Electronics"
              onClick={(e) => setFilters(e.target.value)}
              className={filters === "Electronics" && "fil-css"}
            >
              Electronics
            </button>
            <button
              value="Sports"
              onClick={(e) => setFilters(e.target.value)}
              className={filters === "Sports" && "fil-css"}
            >
              Sports
            </button>
            <button
              value="Home"
              onClick={(e) => setFilters(e.target.value)}
              className={filters === "Home" && "fil-css"}
            >
              Home
            </button>
            <button
              value="Fashion"
              onClick={(e) => setFilters(e.target.value)}
              className={filters === "Fashion" && "fil-css"}
            >
              Fashion
            </button>
          </div>
          {/* Pricing Filters */}
          <p>Price (Min to Max)</p>
          <div className="pricing flex gap-1">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>
        {/* Filters End */}

        {/*  Mapping     Products */}
        <div className="products md:w-10/12">
          <div className="h-auto relative">
            {gigs?.length === 0 && (
              <div className="flex justify-center">
                <h1 className="text-2xl">No Products Available!</h1>
              </div>
            )}
            {gigs && (
              <div className=" grid grid-cols-4 gap-5">
                {/* Mapping start */}
                {filteredProducts?.map((gig) => (
                  <HomeProductsMap
                    product={gig}
                    user={auth?.user}
                    token={auth?.token}
                  />
                ))}
                {/* Mapping End */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeProducts;
