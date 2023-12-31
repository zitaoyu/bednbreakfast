import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlacePhotoGallery from "../components/PlacePhotoGallery";
import ShareSaveButtons from "../components/ShareSaveButtons";
import ALL_PERKS from "../util/perks";
import BookingFormWidget from "../components/BookingFormWidget";
import SectionDivider from "../components/SectionDivider";
import { Icon } from "../components/Icon";
import { ICONS } from "../util/icons";
import Skeleton from "react-loading-skeleton";
import ImageSlider from "../components/ImageSlider";

const PlacePage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [place, setPlace] = useState(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  useEffect(() => {
    if (id) {
      axios
        .get(`/places/${id}`)
        .then((response) => {
          setPlace(response.data);
          setLoading(false);
        })
        .catch(() => {
          alert("Cannot fetch place data, redirecting...");
        });
    }
  }, []);

  const SectionTitle = ({ title }) => {
    return <h1 className="mb-2 text-xl font-semibold">{title}</h1>;
  };

  return (
    <div
      className={`${
        // prevent overflowing overlay
        showAllPhotos && "h-[0vh] overflow-hidden"
      } mx-auto w-full max-w-7xl  px-2 text-sm text-black sm:text-base lg:px-10`}
    >
      {/* Title */}
      <div className="pt-6">
        <h1 className="text-xl font-semibold text-black sm:text-2xl">
          {loading ? <Skeleton /> : place?.title}
        </h1>
        {loading ? (
          <Skeleton />
        ) : (
          <div className="flex flex-col justify-between sm:flex-row">
            <a
              className="text-black underline"
              target="_blank"
              rel="noreferrer"
              href={"https://maps.google.com/?q=" + place?.address}
            >
              <Icon className="m-auto mr-2" icon={ICONS.LOCATION} />
              {place?.address}
            </a>
            <ShareSaveButtons />
          </div>
        )}
      </div>
      {/* Photo Gallery */}
      <div className="block sm:hidden">
        <ImageSlider photos={place ? place.photos : undefined} />
      </div>
      <div className="hidden sm:block">
        <PlacePhotoGallery
          photos={place ? place.photos : undefined}
          showAllPhotos={showAllPhotos}
          setShowAllPhotos={setShowAllPhotos}
        />
      </div>

      {/* Description and Book form*/}
      <div className="my-6 grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
        {loading ? (
          <Skeleton count={5} />
        ) : (
          <div>
            <SectionTitle title={"About this place"} />
            {place?.description}
            <SectionDivider className={"my-6"} />
            <div className="mt-2">
              <SectionTitle title={"What this place offers"} />
              {place?.perks.map((label) => {
                const foundPerk = ALL_PERKS.find(
                  (perk) => perk.label === label,
                );
                if (foundPerk) {
                  return (
                    <div key={label} className="my-2">
                      <Icon icon={foundPerk.icon} className="mr-6 h-6 w-6" />
                      {label}
                    </div>
                  );
                }
              })}
            </div>
          </div>
        )}

        {/* Booking Form */}
        {loading ? (
          <Skeleton containerClassName="flex-1" height={"100%"} />
        ) : (
          place && <BookingFormWidget place={place} />
        )}
      </div>
      <SectionDivider className={"my-10"} />
      {/* Things to know */}
      {!loading && (
        <div>
          <SectionTitle title={"Things to know"} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2 pt-2">
              <span className="font-semibold">House rules</span>
              <span>{place?.checkIn}</span>
              <span>{place?.checkOut}</span>
              <span>{place?.maxGuests} guests maximum</span>
              {/* <a className="font-semibold underline">Show more</a> */}
            </div>
            <div className="flex flex-col gap-4 pt-2">
              <span className="font-semibold">Safety & property</span>
              <span>Self check-in</span>
              <span>Smoke alarm</span>
              <span>Carbon monoxide alarm</span>
              {/* <a className="font-semibold underline">Show more</a> */}
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <span className="font-semibold">Cancelation policy</span>
              <span>Free cancellation for 48 hours.</span>
              <span>
                Review the Host's full cancellation policy which applies even if
                you cancel for illness or disruptions caused by COVID-19.
              </span>
              {/* <a className="font-semibold underline">Show more</a> */}
            </div>
          </div>
          {/* More information */}
          <SectionDivider className={"my-10"} />
          <div className="mb-8">
            <SectionTitle title={"More Information"} />
            {place?.extraInfo}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacePage;
