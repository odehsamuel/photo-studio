const Image = ({ image : {webformatURL, downloads, likes, comments} }) => {
  return (
    <div className="container w-60 overflow-hidden">
      <img src={webformatURL} alt="image-preview" className="w-60 object-cover" />
      <div className="bg-rose-200 py-6 px-1 text-slate-700 text-center mx-auto box-border">
        <span className="py-1 px-3 hover:bg-rose-400/50 hover:text-rose-800 bg-rose-100 text-rose-600 mx-4 rounded-full">
          {likes}
        </span>
        <span className="py-1 px-3 hover:bg-rose-400/50 hover:text-rose-800 bg-rose-100 text-rose-600 mx-4 rounded-full">
          {comments}
        </span>
        <span className="py-1 px-3 hover:bg-rose-400/50 hover:text-rose-800 bg-rose-100 text-rose-600 mx-4 rounded-full">
          {downloads}
        </span>
      </div>
    </div>
  );
};

export default Image;
