import React, { useState } from "react";
// import ImagesContext from "../context/ImagesContext/ImagesContext";

const Pagination = () => {
  // const { images, FetchImages } = useContext(ImagesContext);

  // const [active, setActive] = useState(1);
  const [checked1, setChecked1] = useState(true);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);

  return (
    <div className="mt-2.5">
      <nav aria-label="...">
        <ul class="pagination pagination-sm justify-end mr-4">
          <li
            className={!checked1 ? "page-item" : "page-item active"}
            aria-current="page"
            onClick={() => {
              setChecked1(true);
              setChecked2(false);
              setChecked3(false);
            }}
          >
            <a className="page-link">1</a>
          </li>
          <li
            className={!checked2 ? "page-item" : "page-item active"}
            onClick={() => {
              setChecked1(false);
              setChecked2(true);
              setChecked3(false);
            }}
          >
            <a className="page-link">2</a>
          </li>
          <li
            className={!checked3 ? "page-item" : "page-item active"}
            onClick={() => {
              setChecked1(false);
              setChecked2(false);
              setChecked3(true);
            }}
          >
            <a className="page-link">3</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
