import Header from "../Header";
import ImageList from "../ImageList";

function Home() {
  return (
    <div className="h-full w-full bg-slate-800 relative">

      <div className="sidebar">
        <i
          className="fa fa-arrow-circle-o-left cancel-btn fa-2x"
          aria-hidden="true"
        ></i>
        <div className="sidebar-navigation">

        </div>
      </div>
      <Header />
      <ImageList />
    </div>
  );
}

export default Home;
