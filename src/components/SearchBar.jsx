import { useContext, useState } from "react";
import ImagesContext from "../context/ImagesContext/ImagesContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const { enteredData, SearchImage } = useContext(ImagesContext);
  const [data, setData] = useState("");
  const navigate = useNavigate();
  

  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (data === "") {
      toast.error("pls enter a text to be searched", {
        style: { color: "red" },
      });
    } else {
      SearchImage(data);
      // setData("");
      navigate("/");
    }
  };

  return (
    <form className="relative" onSubmit={handleSubmit}>
      <i className="fa fa-search fa-lg absolute inset-y-2.5 left-2 my-auto text-slate-800"></i>
      <input
        className="search border-none rounded-3xl p-1.5 pl-8 outline-none bg-slate-200 md:w-80 sm:w-60 lg:w-96 w-48 text-base text-slate-700"
        placeholder="Enter search"
        value={data}
        onChange={(e) => {
          enteredData.current = e.target.value;
          localStorage.setItem("searchedData", (e.target.value));
          setData(e.target.value);
        }}
      ></input>
    </form>
  );
};

export default SearchBar;
