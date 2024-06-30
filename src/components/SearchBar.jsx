import { useContext, useState } from "react";
import ImagesContext from "../context/ImagesContext/ImagesContext";
import { toast } from "react-toastify";

const SearchBar = () => {
  const { SearchImage } = useContext(ImagesContext);
  const [enteredData, setEnteredData] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (enteredData === "") {
      toast.error("pls enter a text you want to search", {
        style: {color: "red"}
      });
    } else {
      SearchImage(enteredData);
      setEnteredData("")
    }
  };

  return (
    <form className="relative" onSubmit={handleSubmit}>
      <i className="fa fa-search fa-lg absolute inset-y-2.5 left-2 my-auto text-slate-800"></i>
      <input
        className="border-none rounded-3xl p-1.5 pl-8 outline-none bg-slate-200 md:w-80 sm:w-60 lg:w-96 w-48 text-base text-slate-700"
        placeholder="Enter search"
        value={enteredData}
        onChange={(e) => setEnteredData(e.target.value)}
      ></input>
    </form>
  );
};

export default SearchBar;
