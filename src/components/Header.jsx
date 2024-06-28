import { NavLink } from "react-router-dom";
import { CameraLogo } from "./Mode/CameraLogo";
import SearchBar from "./SearchBar";
import { useContext, useState } from "react";
import ImagesContext from "../context/ImagesContext/ImagesContext";

const Header = () => {
  const {OpenBackdropAndSidebar} = useContext(ImagesContext)
  const [opened, setOpened] = useState(true)

  return (
    <div className="py-2 px-4 flex justify-between items-center flex-grow">
      <NavLink to="/">
        <CameraLogo />
      </NavLink>
      <SearchBar />
      <ul className="navigations">
        <NavLink to={"/login"}>
          <li className="border-none hover:bg-slate-700 rounded-full py-2 px-3 text-center mr-4 text-slate-50">
            Log in
          </li>
        </NavLink>
        <NavLink to={"/sign-up"}>
          <li className="border hover:bg-slate-700 rounded-full py-2 w-20 text-center mr-4 text-slate-50">
            Join
          </li>
        </NavLink>
        <NavLink to={"/sign-up"}>
          <li className="border rounded-full py-2 px-3 hover:bg-green-400/70 bg-green-500 mr-4">
            <i className="fa fa-upload fa-lg mr-2" aria-hidden="true"></i>Upload
          </li>
        </NavLink>
      </ul>
      <div className="hamburger__container" onClick={() => OpenBackdropAndSidebar()}>
        <span className="hamburger-item"></span>
        <span className="hamburger-item"></span>
        <span className="hamburger-item"></span>
      </div>
    </div>
  );
};

export default Header;
