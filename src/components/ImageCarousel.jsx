import { useContext } from "react";
import ImagesContext from "../context/ImagesContext/ImagesContext";

function ImageCarousel() {
  const { images } = useContext(ImagesContext);
  function shuffleArray(images) {
    for (let i = images.length - 1; i > 0; i--) {
      // Generate a random index from 0 to i
      const j = Math.floor(Math.random() * (i + 1));
      // Swap elements array[i] and array[j]
      [images[i], images[j]] = [images[j], images[i]];
    }
    return images;
  }

  const shuffledArray = shuffleArray([...images]);
  const carouselImages = shuffledArray.slice(0, 3);
  // console.log(images)

  if (!images || images.length === 0) {
    return <div>No images available</div>;
  }
  return (
    <div id="carouselExampleIndicators" className="carousel slide ">
      <div className="carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
      </div>
      {carouselImages && (
        <div className="carousel-inner">
          <h3 className="absolute top-40 md:top-44 text-center z-10 w-full px-20 text-slate-100 text-xl">
            <span className="font-bold">Access over 10,000+ wallpapers.</span>{" "}
            Get enhanced and organized photos, adding beautiful wallpapers for
            our viewers.
          </h3>
          <div className="carousel-item active">
            <img
              src={carouselImages[0].webformatURL}
              className="d-block w-100 h-96 object-cover brightness-50"
              alt="carousel image-preview"
            />
          </div>
          <div className="carousel-item">
            <img
              src={carouselImages[1].webformatURL}
              className="d-block w-100 h-96 object-cover brightness-50"
              alt="carousel image-preview"
            />
          </div>
          <div className="carousel-item">
            <img
              src={carouselImages[2].webformatURL}
              className="d-block w-100 h-96 object-cover brightness-50"
              alt="carousel image-preview"
            />
          </div>
        </div>
      )}
      <button
        className="carousel-control-prev z-10"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next z-10"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default ImageCarousel;
