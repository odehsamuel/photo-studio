import { useContext, useEffect, useState } from "react";
import Footer from "../Footer";
import Header from "../Header";
import ImageCarousel from "../ImageCarousel";
import ImageList from "../ImageList";
import ImagesContext from "../../context/ImagesContext/ImagesContext";
import { Loader } from "../Mode/Loader";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.config";

function Home() {
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

  const cancelSideBar = () => {
    backlightElement.classList.remove("open");
    sidebarElement.classList.remove("open");
  };

  const date = new Date().getFullYear();
  const { loading } = useContext(ImagesContext);

  if (loading) {
    return (
      <div className="bg-slate-600/70 w-screen h-screen pt-60 px-half md:px-hlf sm:px-oneqrt">
        <Loader fill={"white"} />
      </div>
    );
  } else {
    return (
      <div className="h-full w-full bg-slate-800 relative">
        <div class="backlight" onClick={cancelSideBar}></div>

        <div class="sidebar bg-rose-100">
          <i
            onClick={cancelSideBar}
            class="fa fa-arrow-left fa-2x cancel-btn mt-2 ml-4 font-normal text-rose-500"
            aria-hidden="true"
          ></i>
          <div class="sidebar-navigation" className="ml-4 mt-4">
            {!loggedIn ? (
              <>
                {" "}
                <Link to="/sign-up" className="w-20 my-4">
                  <p className="w-20 border-2 border-slate-500 bg-slate-300 text-slate-800 rounded-lg py-1.5 text-center">
                    Join
                  </p>
                </Link>
                <Link to="/login" className="w my-4">
                  <p className="w-20 border-2 border-green-500 text-green-500 my-2 text-center rounded-lg py-1.5">
                    Login
                  </p>
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className="w my-4" onClick={handleClick}>
                  <p className="w-20 border-2 border-rose-500 text-rose-500 my-2 text-center rounded-lg py-1.5">
                    Logout
                  </p>
                </Link>
              </>
            )}
            <Link to="/image-upload" className=" my-4">
              <p className="w-20 bg-green-500 text-slate-100 my-2 text-center rounded-lg py-1.5">
                Upload
              </p>
            </Link>
          </div>
        </div>
        <Header />
        <ImageCarousel />
        <ImageList />
        <Footer />
        <div className="text-center text-slate-300 bg-slate-700 py-3">
          Copyright &copy;
          <span>{date};</span> All rights
          {/* <script>document.write(new Date().getFullYear());</script> All rights */}
          reserved
        </div>
      </div>
    );
  }
}

export default Home;
