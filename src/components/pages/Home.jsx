import { useState } from "react";
import Footer from "../Footer";
import Header from "../Header";
import ImageCarousel from "../ImageCarousel";
import ImageList from "../ImageList";
import { Loader } from "../Mode/Loader";
import { useAuthStatus } from "../hooks/useAuthStatus";

function Home() {
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
        <ImageCarousel />
        <ImageList />
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
