import React from "react";
import Title from "./Title";
import { assets, exclusiveOffers } from "../assets/assets";

const ExclusiveOffers = () => {
  return (
    <div className="flex flex-col items-center px-4 pb-20 pt-16 sm:px-6 md:px-12 lg:px-20 xl:px-32">
      <div className="flex w-full flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <Title
          align="left"
          title="Exclusive Offers"
          subTitle="Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories."
        />

        <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-50">
          View All Offers
        </button>
      </div>

      <div className="mt-12 grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {exclusiveOffers.map((item) => (
          <div
            key={item._id}
            className="group relative flex min-h-[260px] flex-col justify-end gap-2 rounded-2xl bg-cover bg-center bg-no-repeat px-5 pb-6 pt-16 text-white shadow-lg"
            style={{ backgroundImage: `url(${item.image})` }}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
            <p className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-800">
              {item.priceOff}% OFF
            </p>

            <div className="relative z-10">
              <p className="text-2xl font-medium font-playfair">{item.title}</p>
              <p className="mt-2 text-sm text-white/85">{item.description}</p>
              <p className="mt-3 text-xs text-white/70">Expires {item.expiryDate}</p>

              <button className="mt-4 flex items-center gap-2 font-medium">
                View Offers
                <img
                  className="invert transition-all group-hover:translate-x-1"
                  src={assets.arrowIcon}
                  alt="arrow icon"
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExclusiveOffers;
