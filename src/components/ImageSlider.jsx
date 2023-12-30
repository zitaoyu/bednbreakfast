import { useEffect, useState } from "react";
import { Icon } from "../components/Icon";
import { ICONS } from "../util/icons";
import Skeleton from "react-loading-skeleton";

const ImageSlider = ({ photos }) => {
  const [loading, setLoading] = useState(true);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [imageAnimation, setImageAnimation] = useState("");

  useEffect(() => {
    if (photos) {
      const loadImage = (url) => {
        return new Promise((resolve, reject) => {
          const loadImg = new Image();
          loadImg.src = url;
          // wait 2 seconds to simulate loading time
          loadImg.onload = () =>
            setTimeout(() => {
              resolve(url);
            }, 2000);

          loadImg.onerror = (err) => reject(err);
        });
      };

      Promise.all(photos.map((image) => loadImage(image))).then(() =>
        setLoading(false),
      );
    }
  }, [photos]);

  function updatePhotoIndex(e, offset) {
    let newIndex = (photoIndex + offset) % photos.length;
    if (newIndex < 0) {
      newIndex = photos.length + newIndex;
    }
    setPhotoIndex(newIndex);
    setImageAnimation("animate-image-fade-in");
    e.stopPropagation();
  }

  return (
    <div className="group relative h-full w-full">
      {loading ? (
        <Skeleton className="aspect-square h-full w-full rounded-2xl" />
      ) : (
        <img
          key={photoIndex}
          className={"aspect-square rounded-2xl object-cover " + imageAnimation}
          src={photos[photoIndex]}
        />
      )}

      <button
        className="absolute top-1/2 ml-1 hidden -translate-y-1/2 opacity-70 hover:opacity-100 group-hover:block"
        onClick={(e) => updatePhotoIndex(e, -1)}
      >
        <Icon
          icon={ICONS.LEFT_ARROW}
          className="h-4 w-4 rounded-full bg-white p-2"
        />
      </button>
      <button
        className="absolute right-0 top-1/2 mr-1 hidden -translate-y-1/2 opacity-70 hover:opacity-100 group-hover:block"
        onClick={(e) => updatePhotoIndex(e, 1)}
      >
        <Icon
          icon={ICONS.RIGHT_ARROW}
          className="h-4 w-4 rounded-full bg-white p-2"
        />
      </button>
    </div>
  );
};

export default ImageSlider;
