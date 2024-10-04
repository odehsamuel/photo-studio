import { Link } from "react-router-dom";
import { useAuthStatus } from "./hooks/useAuthStatus";

const SidebarModal = () => {
  const { loggedIn, handleClick } = useAuthStatus();

  return (
    <div class="hamburger__container">
      <button
        className="hamburger__container-btn"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasRight"
        aria-controls="offcanvasRight"
      >
        <span className="hamburger-item"></span>
        <span className="hamburger-item"></span>
        <span className="hamburger-item"></span>
      </button>

      <div
        class="offcanvas offcanvas-end bg-rose-100 !w-3/4"
        tabindex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <div>
          <button type="button" data-bs-dismiss="offcanvas" aria-label="Close">
            <i
              className="fa fa-times-circle-o fa-3x cancel-btn mt-2 ml-4 py-2 font-normal text-rose-500"
              aria-hidden="true"
            ></i>
          </button>
        </div>
        <div className="sidebar-navigation ml-4">
          {!loggedIn ? (
            <>
              {" "}
              <Link to="/sign-up" className="w-20 my-4">
                <p className="w-20 border-2 border-slate-500 bg-slate-300 text-slate-800 rounded-lg py-1.5 text-center" data-bs-dismiss="offcanvas" aria-label="Close">
                  Join
                </p>
              </Link>
              <Link to="/login" className="w my-4">
                <p className="w-20 border-2 border-green-500 text-green-500 my-2 text-center rounded-lg py-1.5" data-bs-dismiss="offcanvas" aria-label="Close">
                  Login
                </p>
              </Link>
              <Link to="/image-upload" className=" my-4">
                <p className="w-20 bg-green-500 text-slate-100 my-2 text-center rounded-lg py-1.5" data-bs-dismiss="offcanvas" aria-label="Close">
                  Upload
                </p>
              </Link>
            </>
          ) : (
            <>
              <Link to="/" className="w my-4" onClick={handleClick}>
                <p className="w-20 border-2 border-rose-500 text-rose-500 my-2 text-center rounded-lg py-1.5" data-bs-dismiss="offcanvas" aria-label="Close">
                  Logout
                </p>
              </Link>
              {/* <Link to={"/account"}>
                <p className="w-20 border-2 border-green-500 text-green-500 my-2 text-center rounded-lg py-1.5" data-bs-dismiss="offcanvas" aria-label="Close">
                  Account
                </p>
              </Link> */}
              <Link to="/image-upload" className=" my-4">
                <p className="w-20 bg-green-500 text-slate-100 my-2 text-center rounded-lg py-1.5" data-bs-dismiss="offcanvas" aria-label="Close">
                  Upload
                </p>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarModal;
