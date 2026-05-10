import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Title from "./Title";
import { assets } from "../assets/assets";
import API_BASE_URL from "../config/api";

const ExclusiveOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(
          `${API_BASE_URL}/api/rooms/discounted?limit=3`,
        );
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch offers");
          setOffers([]);
          return;
        }

        setOffers(data);
      } catch (err) {
        console.error("Error fetching discounted offers:", err);
        setError(err.message || "Failed to fetch offers");
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return (
    <div className="flex flex-col items-center px-4 pb-20 pt-16 sm:px-6 md:px-12 lg:px-20 xl:px-32">
      <div className="flex w-full flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <Title
          align="left"
          title="Exclusive Offers"
          subTitle="Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories."
        />

        <button
          onClick={() => navigate("/offers")}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
        >
          View All Offers
        </button>
      </div>

      <div className="mt-12 grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="col-span-full rounded-2xl bg-gray-100 px-6 py-10 text-center text-gray-600">
            Loading offers...
          </div>
        ) : error ? (
          <div className="col-span-full rounded-2xl bg-red-50 px-6 py-10 text-center text-red-600">
            {error}
          </div>
        ) : offers.length === 0 ? (
          <div className="col-span-full rounded-2xl bg-gray-100 px-6 py-10 text-center text-gray-600">
            No discounted offers available.
          </div>
        ) : (
          offers.map((item) => (
            <div
              key={item._id}
              className="group relative flex min-h-[260px] flex-col justify-end gap-2 rounded-2xl bg-cover bg-center bg-no-repeat px-5 pb-6 pt-16 text-white shadow-lg"
              style={{ backgroundImage: `url(${item.images?.[0] || ""})` }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
              <p className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-800">
                {item.discount}% OFF
              </p>

              <div className="relative z-10">
                <p className="text-2xl font-medium font-playfair">
                  {item.title}
                </p>
                <p className="mt-2 text-sm text-white/85">
                  {item.description || item.location}
                </p>
                <p className="mt-3 text-xs text-white/70">
                  Now ₹{item.price - item.discount} (was ₹{item.price})
                </p>

                <button
                  onClick={() => navigate(`/rooms/${item._id}`)}
                  className="mt-4 flex items-center gap-2 font-medium"
                >
                  View Offers
                  <img
                    className="invert transition-all group-hover:translate-x-1"
                    src={assets.arrowIcon}
                    alt="arrow icon"
                  />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExclusiveOffers;
