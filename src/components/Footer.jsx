import React from "react";

const Footer = () => {
  return (
    <div>
      <hr />
      <div className="my-4 text-slate-600 grid grid-cols-1 md:grid-cols-3 sm:grid-cols-1 lg:justify-items-center px-4 gap-4">
        <div className="">
          <h3 className="text-slate-500 font-bold">About Us</h3>
          <p>
            We enhance and organize your photos professionally, adding beautiful
            wallpapers for viewers.
          </p>
          <ul className="">
            <li>
              <a href="#">
                <i className="fa fa-map-marker text-rose-500"></i>1734 Maryland
                Road
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa fa-phone text-rose-500"></i>+234-813-237-0533
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa fa-envelope-o text-rose-500"></i>
                email@email.com
              </a>
            </li>
          </ul>
        </div>

        <div className="footer">
          <h3 className="footer-title text-slate-500 font-bold">Categories</h3>
          <ul className="footer-links">
            <li>
              <a href="#">Clothings</a>
            </li>
            <li>
              <a href="#">Laptops</a>
            </li>
            <li>
              <a href="#">Houses</a>
            </li>
            <li>
              <a href="#">Cameras</a>
            </li>
          </ul>
        </div>

        {/* <div className="clearfix visible-xs"></div> */}

        <div className="footer">
          <h3 className="footer-title text-slate-500 font-bold">Information</h3>
          <ul className="footer-links">
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Terms & Conditions</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
