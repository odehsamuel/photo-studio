import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ImagesContextProvider } from "./context/ImagesContext/ImagesContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import SignUp from "./components/pages/SignUp";
import NotFound from "./components/pages/NotFound";

function App() {
  return (
    <ImagesContextProvider>
      <Router>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/not-found" element={<NotFound />} />
          </Routes>
        <ToastContainer />
      </Router>
    </ImagesContextProvider>
  );
}

export default App;
