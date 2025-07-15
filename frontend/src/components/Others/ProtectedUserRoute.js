import { useSelector } from "react-redux";

const ProtectedUserRoute = ({ children }) => {
  const { auth } = useSelector((state) => state.auth);
  return (
    <div>{auth && auth.user.role === "User" && <div>{children}</div>}</div>
  );
};

export default ProtectedUserRoute;
