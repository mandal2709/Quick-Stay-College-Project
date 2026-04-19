import React from "react";

const Footer = () => {
  return (
    <footer className="flex w-full justify-center bg-[#E5E7EB] py-12">
      <div className="grid w-full max-w-6xl grid-cols-1 gap-8 px-6 text-center sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col items-center">
          <h2 className="mb-5 font-semibold text-gray-800">QuickStay</h2>
          <p className="mt-2 text-sm text-gray-600">
            Stay - Your trusted online hotel booking platform to find, compare,
            and book the perfect stay anywhere, anytime. Enjoy comfort,
            convenience, and the best deals at your fingertips.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <h2 className="mb-5 font-semibold text-gray-800">Company</h2>
          <div className="flex flex-col gap-2 text-sm">
            <a className="transition hover:text-slate-600" href="#">
              About us
            </a>
            <a className="transition hover:text-slate-600" href="#">
              Contact us
            </a>
            <a className="transition hover:text-slate-600" href="#">
              Privacy policy
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h2 className="mb-5 font-semibold text-gray-800">
            Subscribe to our Website - Stay
          </h2>
          <p className="max-w-xs text-sm text-gray-600">
            The latest news and resources, sent to your inbox weekly.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
