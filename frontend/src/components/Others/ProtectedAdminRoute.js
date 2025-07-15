import { useSelector } from "react-redux";

const ProtectedAdminRoute = ({ children }) => {
  const { auth } = useSelector((state) => state.auth);
  return (
    <div>{auth && auth.user.role === "Admin" && <div>{children}</div>}</div>
  );
};

export default ProtectedAdminRoute;
