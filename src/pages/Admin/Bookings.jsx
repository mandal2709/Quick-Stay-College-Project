import React from "react";
import Title from "../../components/Title";

const Bookings = () => {
  return (
    <div>
      <Title
        align="left"
        font="oufit"
        title="Bookings"
        subTitle="Review and manage booking requests across properties."
      />

      <div className="py-8">
        <p className="text-gray-600">
          This area will show booking activity and allow you to manage
          reservations.
        </p>
      </div>
    </div>
  );
};

export default Bookings;
