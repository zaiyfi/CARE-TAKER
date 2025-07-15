import { useSelector } from "react-redux";

const ProtectedLogin = ({ children }) => {
  const { auth } = useSelector((state) => state.auth);
  return <div>{auth && children}</div>;
};

export default ProtectedLogin;
