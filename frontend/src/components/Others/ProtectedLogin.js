import { useSelector } from "react-redux";
import Page404 from "../../pages/Page404";

const ProtectedLogin = ({ children }) => {
  const { auth } = useSelector((state) => state.auth);

  // Prevent false negatives when auth is still loading (optional)
  if (auth === undefined) return null;

  // If not authenticated
  if (!auth?.token || !auth?.user?._id) {
    return <Page404 />;
  }

  return children;
};

export default ProtectedLogin;
