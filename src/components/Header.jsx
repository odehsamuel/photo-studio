import { CameraLogo } from "./Mode/CameraLogo"
import SearchBar from "./SearchBar"

const Header = () => {
  return (
    <div className="py-2 px-4 flex justify-between items-center flex-grow">
        <CameraLogo/>
        <SearchBar/>
        <ul className="flex">
            <li className="border-none hover:bg-slate-700 rounded-full py-2 px-3 text-center mr-4 text-slate-50">Log in</li>
            <li className="border hover:bg-slate-700 rounded-full py-2 w-20 text-center mr-4 text-slate-50">Join</li>
            <li className="border rounded-full py-2 px-3 hover:bg-green-400/70 bg-green-500 mr-4"><i className="fa fa-upload fa-lg mr-2" aria-hidden="true"></i>Upload</li>
        </ul>
    </div>
  )
}

export default Header;