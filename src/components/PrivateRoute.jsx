import { Outlet, Navigate } from "react-router-dom";
import { Loader } from "./Mode/Loader";
import { useAuthStatus } from "./hooks/useAuthStatus";

const PrivateRoute = () => {
  const { isLoading, loggedIn } = useAuthStatus();

  if (isLoading) {
    return (
      <div className="bg-slate-600/70 w-screen h-screen pt-60 px-half md:px-hlf sm:px-oneqrt">
        <Loader fill={"white"} />
      </div>
    );
  }

  return loggedIn ? <Outlet /> : <Navigate to={"/sign-up"} />;
};

export default PrivateRoute;
