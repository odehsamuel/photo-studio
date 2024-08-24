import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ImagesContextProvider } from "./context/ImagesContext/ImagesContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import SignUp from "./components/pages/SignUp";
import NotFound from "./components/pages/NotFound";
import ForgottenPassword from "./components/pages/ForgottenPassword";
import ImagePreview from "./components/pages/ImagePreview";
import ImageUpload from "./components/pages/ImageUpload";
import PrivateRoute from "./components/PrivateRoute";
import Account from "./components/pages/Account";

function App() {
  return (
    <ImagesContextProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgottenPassword />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/image-upload" element={<PrivateRoute />}>
            <Route path="/image-upload" element={<ImageUpload />} />
          </Route>
          <Route path="/image-preview/:tags/:id" element={<ImagePreview />} />
          <Route path="/account" element={<Account />} />
        </Routes>
        <ToastContainer />
      </Router>
    </ImagesContextProvider>
  );
}

export default App;
