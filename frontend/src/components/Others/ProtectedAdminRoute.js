import { useSelector } from "react-redux";
import Page404 from "../../pages/Page404";

const ProtectedAdminRoute = ({ children }) => {
  const { auth } = useSelector((state) => state.auth);

  // Check if the user is authenticated and is an admin
  if (!auth || !auth.token || !auth.user || auth.user.role !== "Admin") {
    return <Page404 />;
  }

  return children;
};

export default ProtectedAdminRoute;
