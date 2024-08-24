import { useContext, useState } from "react";
import ImagesContext from "../context/ImagesContext/ImagesContext";

const Pagination = () => {
  const { images, FetchImages, SearchImage } = useContext(ImagesContext);

  const [checked1, setChecked1] = useState(true);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);
  // const [checked4, setChecked4] = useState(false);

  const searched = localStorage.getItem("searchedData");

  return (
    <div className="mt-2.5">
      <nav aria-label="...">
        <ul class="pagination pagination-sm justify-end mr-4">
          <li
            className={
              !checked1
                ? "page-item cursor-pointer"
                : "page-item active cursor-pointer"
            }
            aria-current="page"
            onClick={() => {
              {
                searched === "isFalse"
                  ? FetchImages(undefined, 1)
                  : SearchImage(searched, undefined, 1);
              }
              setChecked1(true);
              setChecked2(false);
              setChecked3(false);
            }}
          >
            <a className="page-link">1</a>
          </li>
          <li
            className={
              !checked2
                ? "page-item cursor-pointer"
                : "page-item active cursor-pointer"
            }
            onClick={() => {
              {
                searched === "isFalse"
                  ? FetchImages(undefined, 2)
                  : SearchImage(searched, undefined, 2);
              }
              setChecked1(false);
              setChecked2(true);
              setChecked3(false);
            }}
            >
            <a className="page-link">2</a>
          </li>
          <li
            className={
              !checked3
                ? "page-item cursor-pointer"
                : "page-item active cursor-pointer"
            }
            onClick={() => {
              {
                searched === "isFalse"
                ? FetchImages(undefined, 3)
                : SearchImage(searched, undefined, 3);
              }
              setChecked1(false);
              setChecked2(false);
              setChecked3(true);
            }}
          >
            <a className="page-link">3</a>
          </li>
          {/* {images.length > 39 && (
            <li
              className={
                !checked4
                  ? "page-item cursor-pointer"
                  : "page-item active cursor-pointer"
              }
              onClick={() => {
                FetchImages(undefined, 4);
                setChecked1(false);
                setChecked2(false);
                setChecked3(false);
                setChecked4(true);
              }}
            >
              <a className="page-link">
                <i className="fa fa-arrow-right"></i>
              </a>
            </li>
          )} */}
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
