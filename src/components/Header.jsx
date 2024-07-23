import { NavLink } from "react-router-dom";
import { CameraLogo } from "./Mode/CameraLogo";
import SearchBar from "./SearchBar";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";

const Header = () => {
  const hamburguerButton = document.querySelector(".hamburger__container");
  const backlightElement = document.querySelector(".backlight");
  const sidebarElement = document.querySelector(".sidebar");

  const [loggedIn, setLoggedIn] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.uid) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLoggedIn(user);
        } else {
          setLoggedIn(false);
        }
      } else {
        setLoggedIn(false);
      }
    });
    return () => unSubscribe();
  }, [auth]);

  function handleClick() {
    auth.signOut();
  }

  const OpenBackdropAndSidebar = () => {
    hamburguerButton.addEventListener("click", () => {
      backlightElement.classList.add("open");
      sidebarElement.classList.add("open");
    });
    console.log("Clicked")
  };

  return (
    <div className="absolute">
      <div className="py-2 px-4 flex justify-between items-center flex-grow fixed z-20 w-full">
        <NavLink to="/">
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
            </>
          ) : (
            <NavLink to={"/"} onClick={handleClick}>
              <li className="border-2 hover:border-green-500 hover:text-green-500 rounded-full py-2 px-3 text-center mr-4 text-slate-50">
                Log out
              </li>
            </NavLink>
          )}

          <NavLink to={"/image-upload"}>
            <li className="border rounded-full py-2 px-3 hover:bg-green-600 bg-green-500 mr-4">
              <i className="fa fa-upload fa-lg mr-2" aria-hidden="true"></i>
              Upload
            </li>
          </NavLink>
        </ul>
        <div
          className="hamburger__container"
          onClick={OpenBackdropAndSidebar}
        >
          <span className="hamburger-item"></span>
          <span className="hamburger-item"></span>
          <span className="hamburger-item"></span>
        </div>
      </div>
    </div>
  );
};

export default Header;
