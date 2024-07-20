import { useContext } from "react";
import Footer from "../Footer";
import Header from "../Header";
import ImageCarousel from "../ImageCarousel";
import ImageList from "../ImageList";
import ImagesContext from "../../context/ImagesContext/ImagesContext";
import { Loader } from "../Mode/Loader";

function Home() {
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
        <div className="sidebar">
          <i
            className="fa fa-arrow-circle-o-left cancel-btn fa-2x"
            aria-hidden="true"
          ></i>
          <div className="sidebar-navigation"></div>
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
