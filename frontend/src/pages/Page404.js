import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Page404 = () => {
  const { auth } = useSelector((state) => state.auth);

  return (
    <div className="absolute top-1/3 left-2/4 -translate-x-2/4">
      <h1 className="text-center text-xl font-bold">404 - Page not found!</h1>
      <p className="text-center mt-2">
        This can happen if you have gone to the{" "}
        <span className="font-bold">wrong route</span> or{" "}
        <span className="font-bold">not logged in!</span>
      </p>
      {!auth?.token && (
        <div className="flex justify-center gap-2 mt-4">
          <Link to="/login" className="underline">
            Login
          </Link>
          <span>or</span>
          <Link to="/register" className="underline">
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default Page404;
