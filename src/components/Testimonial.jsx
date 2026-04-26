import React from "react";
import Title from "./Title";
import { testimonials } from "../assets/assets";
import StarRating from "./StarRating";
import API_BASE_URL from "../config/api";
import { useState, useEffect } from "react";

const Testimonial = () => {
  const [testimonialData, setTestimonialData] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/rooms/5-star-reviews`,
        );
        const data = await response.json();
        console.log("Fetched data:", data);
        setTestimonialData(data.reviews || []); // Ensure we set an empty array if reviews is undefined
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchTestimonials();
  }, []);

  const colors = [
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-yellow-500",
  ];

  const getColor = (name = "") => {
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="flex flex-col items-center bg-slate-50 px-4 pb-20 pt-16 sm:px-6 md:px-12 lg:px-20">
      <Title
        title="What Our Guest Say"
        subTitle=" Discover why discrening travelers consistently choose
      for execlusive and luxurious accommodations around the world"
      />

      <div className="mt-12 w-full overflow-hidden">
        <div className="flex gap-6 animate-scroll">
          {[...testimonialData, ...testimonialData].map(
            (testimonial, index) => (
              <div
                key={index}
                className="min-w-[300px] max-w-sm rounded-2xl bg-white p-6 shadow"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-full text-white font-semibold text-lg uppercase ${getColor(testimonial.name)}`}
                  >
                    {testimonial.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-playfair text-xl">{testimonial.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mt-4">
                  <StarRating rating={testimonial.rating} />
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-500 sm:text-base">
                  {testimonial.comment}
                </p>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
