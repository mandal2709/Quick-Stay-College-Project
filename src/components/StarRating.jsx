import React from "react";
import { assets } from "../assets/assets";

const StarRating = ({ rating = 0 }) => {
  const numericRating = Math.min(Math.max(Number(rating) || 0, 0), 5);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => (
        <img
          key={index}
          src={
            numericRating > index
              ? assets.starIconFilled
              : assets.starIconOutlined
          }
          alt={numericRating > index ? "filled star" : "outlined star"}
          className="w-5 h-5"
        />
      ))}
    </div>
  );
};

export default StarRating;
