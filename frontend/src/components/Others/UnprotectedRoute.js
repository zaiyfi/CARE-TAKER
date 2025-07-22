import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const UnprotectedRoute = ({ children }) => {
  const { auth } = useSelector((state) => state.auth);

  if (auth && auth.user) {
    return <Navigate to="/" />; // ✅ Redirect logged-in users
  }

  return children; // ✅ Allow access to non-authenticated users
};

export default UnprotectedRoute;
