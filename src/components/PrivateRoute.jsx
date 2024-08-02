import { Outlet, Navigate } from "react-router-dom";
import { Loader } from "./Mode/Loader";
import { useAuthStatus } from "./hooks/useAuthStatus";

const PrivateRoute = () => {
  const { isLoading, loggedIn } = useAuthStatus();

  if (isLoading) {
    return (
      <div className="loading w-screen h-screen fixed">
        <Loader fill={"black"} />
      </div>
    );
  }

  return loggedIn ? <Outlet /> : <Navigate to={"/sign-up"} />;
};

export default PrivateRoute;
