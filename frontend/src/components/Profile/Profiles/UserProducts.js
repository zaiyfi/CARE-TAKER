import { useSelector } from "react-redux";
import HomeProductsMap from "../../HomeProductsMap";

const UserProducts = ({ user, products, token, productLength }) => {
  const { gigs } = useSelector((state) => state.gigs);
  const filteredGigs = gigs.filter((p) => p.applicantId === user._id);
  productLength(filteredGigs?.length);
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 my-6">
      {gigs &&
        filteredGigs.map((gig) => (
          <div>
            <HomeProductsMap
              key={gig._id}
              product={gig}
              user={user}
              token={token}
            />
          </div>
        ))}
    </div>
  );
};

export default UserProducts;
