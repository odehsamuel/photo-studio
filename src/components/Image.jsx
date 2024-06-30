import { Link } from "react-router-dom";

const Image = ({
  image: { webformatURL, downloads, likes, comments, previewURL },
}) => {
  return (
    <div className="container overflow-hidden">
      <Link to={"/image-preview"}>
        <div className="relative">
          <img
            src={webformatURL}
            alt="image-preview"
            className="object-cover hover:brightness-50 w-full h-80"
          />
          <a
            href={previewURL}
            className="hover:bg-rose-300 bg-rose-200 py-0.5 px-1.5 flex items-center rounded-md absolute bottom-3 right-2"
          >
            <i class="fa fa-download mr-2" aria-hidden="true"></i>
            <p>Download</p>
          </a>
        </div>
      </Link>
      <div className="bg-rose-200 py-6 px-1 text-slate-700 text-center mx-auto box-border flex justify-evenly">
        <div>
          <span className="text-xs py-0.5 px-2 hover:bg-rose-400/50 hover:text-rose-800 bg-rose-100 text-rose-600 mx-4 rounded-full">
            {likes}
          </span>
          <p className="text-xs font-bold text-rose-600">Likes</p>
        </div>
        <div>
          <span className="text-xs py-0.5 px-2 hover:bg-rose-400/50 hover:text-rose-800 bg-rose-100 text-rose-600 mx-4 rounded-full">
            {comments}
          </span>
          <p className="text-xs font-bold text-rose-600">Comments</p>
        </div>
        <div>
          <span className="text-xs py-0.5 px-2 hover:bg-rose-400/50 hover:text-rose-800 bg-rose-100 text-rose-600 mx-4 rounded-full">
            {downloads}
          </span>
          <p className="text-xs font-bold text-rose-600">Downloads</p>
        </div>
      </div>
    </div>
  );
};

export default Image;
