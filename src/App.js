// import "./App.css";
import "./index.css";
import Header from "./components/Header";
import ImageList from "./components/ImageList";
import {ImagesContextProvider} from "./context/ImagesContext/ImagesContext";

function App() {
  return (
    <ImagesContextProvider>
      <div className="h-full w-full bg-slate-800">
        <Header />
        <ImageList />
      </div>
    </ImagesContextProvider>
  );
}

export default App;
