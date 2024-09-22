import { NavLink } from "react-router-dom";
import { CameraLogo } from "./Mode/CameraLogo";
import SearchBar from "./SearchBar";
import { useAuthStatus } from "./hooks/useAuthStatus";
import SidebarModal from "./SidebarModal";

const Header = () => {
  const { loggedIn, handleClick } = useAuthStatus();

  document.addEventListener("scroll", () => {
    const heroImage = document.getElementById("carouselExampleIndicators");
    const headerSection = document.querySelector(".header");

    if (heroImage) {
      const heroImageBottom = heroImage.getBoundingClientRect().bottom;
      if (heroImageBottom < 295) {
        headerSection.classList.add("bg-slate-600");
      } else {
        headerSection.classList.remove("bg-slate-600");
      }
    } else return;
  });

  return (
    <div className="absolute">
      <div className="header py-2 px-4 flex justify-between items-center fixed z-20 w-full">
        <NavLink
          to="/"
          onClick={() => {
            localStorage.setItem("searchedData", "isFalse");
          }}
        >
          <CameraLogo fill={"#c5c3c3"} />
        </NavLink>
        <SearchBar />
        <ul className="navigations">
          {!loggedIn ? (
            <>
              <NavLink to={"/login"}>
                <li className="border-2 hover:border-green-500 hover:text-green-500 rounded-full py-2 px-3 text-center mr-4 text-slate-50">
                  Log in
                </li>
              </NavLink>
              <NavLink to={"/sign-up"}>
                <li className="border hover:bg-slate-700 rounded-full py-2 w-20 text-center mr-4 text-slate-50 bg-slate-800">
                  Join
                </li>
              </NavLink>
              <NavLink to={"/image-upload"}>
                <li className="border rounded-full py-2 px-3 hover:bg-green-600 bg-green-500 mr-4">
                  <i className="fa fa-upload fa-lg mr-2" aria-hidden="true"></i>
                  Upload
                </li>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to={"/"} onClick={handleClick}>
                <li className="border-2 hover:border-green-500 hover:text-green-500 rounded-full py-2 px-3 text-center mr-4 text-slate-50">
                  Logout
                </li>
              </NavLink>
              {/* <NavLink to={"/account"}>
                <li className="border-2 hover:border-green-500 hover:text-green-500 rounded-full py-2 px-3 text-center mr-4 text-slate-50">
                  Account
                </li>
              </NavLink> */}
              <NavLink to={"/image-upload"}>
                <li className="border rounded-full py-2 px-3 hover:bg-green-600 bg-green-500 mr-4">
                  <i className="fa fa-upload fa-lg mr-2" aria-hidden="true"></i>
                  Upload
                </li>
              </NavLink>
            </>
          )}
        </ul>
        <SidebarModal />
      </div>
    </div>
  );
};

export default Header;
