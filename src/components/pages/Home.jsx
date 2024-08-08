import { useContext, useState } from "react";
import Footer from "../Footer";
import Header from "../Header";
import ImageCarousel from "../ImageCarousel";
import ImageList from "../ImageList";
import { Loader } from "../Mode/Loader";
import { useAuthStatus } from "../hooks/useAuthStatus";
import ImagesContext from "../../context/ImagesContext/ImagesContext";

function Home() {
  const { isSearchValid } = useContext(ImagesContext);
  const { isLoading } = useAuthStatus();
  const date = new Date().getFullYear();

  if (isLoading) {
    return (
      <div className="loading w-screen h-screen fixed">
        <Loader fill={"black"} />
      </div>
    );
  } else {
    return (
      <div className="h-full w-full bg-slate-800 relative" id="viewport">
        <Header />
        {isSearchValid ? (
          <>
            <ImageCarousel />
            <ImageList />
          </>
        ) : (
          <div className="py-52 text-center bg-slate-700">
            <h3 className="text-5xl text-rose-500 ">Invalid Search</h3>
            <p className="text-slate-100">Try entering a new search.</p>
          </div>
        )}
        <Footer />
        <div className="text-center text-slate-300 bg-slate-700 py-3">
          Copyright &copy;
          <span>{date};</span> All rights reserved
        </div>
      </div>
    );
  }
}

export default Home;
