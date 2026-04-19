import React from "react";
import HeroImage from "../assets/heroImage.png";

const About = () => {
  const handleEmailClick = () => {
    const email = "flurt2709@gmail.com";
    const subject = encodeURIComponent("Support Request");
    const body = encodeURIComponent("Hi Team, I need help with...");

    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`,
      "_blank",
    );
  };
  return (
    <div className="py-24 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-10 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Welcome to QuickStay
            </h1>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6">
              QuickStay is your premium hotel booking platform built for modern
              travelers. We connect guests to thousands of handpicked hotels,
              boutique stays, and luxury suites across the globe. Our mission is
              to simplify discovery, provide transparent pricing, and deliver
              5-star service from search to check-out.
            </p>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6">
              We prioritize:
            </p>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">●</span>
                Secure bookings and fast confirmations
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">●</span>
                Real guest reviews and highly rated stays
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">●</span>
                24/7 customer support and flexible cancellation
              </li>
            </ul>
          </div>

          <div className="relative">
            <img
              src={
                HeroImage ||
                "https://images.unsplash.com/photo-1501117716987-c8e313ad52cc?auto=format&fit=crop&w=1100&q=80"
              }
              alt="Hotel overview"
              className="w-full h-full object-cover min-h-[320px]"
            />
          </div>
        </div>

        <div className="p-10 border-t border-slate-100">
          <h2 className="text-3xl font-semibold text-slate-800 mb-4">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-blue-50 p-5 rounded-xl">
              <h3 className="font-semibold text-blue-700">1. Explore</h3>
              <p className="text-slate-600 mt-2">
                Browse curated hotels with verified amenities and ratings.
              </p>
            </div>
            <div className="bg-blue-50 p-5 rounded-xl">
              <h3 className="font-semibold text-blue-700">2. Book</h3>
              <p className="text-slate-600 mt-2">
                Choose dates, compare prices, and confirm instantly.
              </p>
            </div>
            <div className="bg-blue-50 p-5 rounded-xl">
              <h3 className="font-semibold text-blue-700">3. Stay</h3>
              <p className="text-slate-600 mt-2">
                Enjoy seamless check-in and dedicated guest support.
              </p>
            </div>
          </div>

          <div className="mt-8 bg-slate-100 p-6 rounded-xl border border-slate-200">
            <h3 className="text-2xl font-semibold text-slate-800 mb-3">
              Pro Tip
            </h3>
            <p className="text-slate-600">
              For the best stay, filter by rating and recent guest reviews, then
              compare prices using exact check-in/check-out dates. After your
              trip, add an honest review to help other travelers choose the
              right room.
            </p>
          </div>

          <div id="team" className="mt-10">
            <h2 className="text-3xl font-semibold text-slate-800 mb-4">
              Meet our team
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border p-4 rounded-lg bg-white">
                <p className="text-xl font-medium">Abhishek Mandal</p>
                <p className="text-slate-500">Founder & CEO</p>
                <p className="text-slate-600 mt-2 text-sm">
                  Leading product vision, customer experience and business
                  strategy.
                </p>
              </div>
              <div className="border p-4 rounded-lg bg-white">
                <p className="text-xl font-medium">Harshal Nigade</p>
                <p className="text-slate-500">CTO</p>
                <p className="text-slate-600 mt-2 text-sm">
                  Coordinates engineering and platform reliability for scalable
                  booking systems.
                </p>
              </div>
              <div className="border p-4 rounded-lg bg-white">
                <p className="text-xl font-medium">Virendra Patil</p>
                <p className="text-slate-500">Head of Trust</p>
                <p className="text-slate-600 mt-2 text-sm">
                  Ensures verified listings, guest safety, and responsive
                  support.
                </p>
              </div>
            </div>
          </div>

          <div
            id="contact"
            className="mt-10 bg-slate-50 p-6 rounded-xl border border-slate-200"
          >
            <h2 className="text-3xl font-semibold text-slate-800 mb-4">
              Contact Us
            </h2>
            <p className="text-slate-600 mb-5">
              Have a question or need help with a booking? Reach out and our
              team will get back to you quickly.
            </p>
            <button
              onClick={handleEmailClick}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition"
            >
              Email Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
