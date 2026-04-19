import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
     <footer className="w-full flex justify-center py-12 bg-[#E5E7EB]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full px-6 text-center">

        {/* Stay Section */}
        <div className="flex flex-col items-center">
            
          <h2 className="font-semibold mb-5 text-gray-800">QuickStay</h2>
          <p className="text-sm text-gray-600 mt-2">
            Stay – Your trusted online hotel booking platform to find, 
            compare, and book the perfect stay anywhere, anytime. Enjoy comfort, convenience,
             and the best deals at your fingertips.
          </p>
        </div>

        {/* Company Section */}
        <div className="flex flex-col items-center">
          <h2 className="font-semibold mb-5 text-gray-800">Company</h2>
          <div className="flex flex-col gap-2 text-sm">
            <a className="hover:text-slate-600 transition" href="#">
              About us
            </a>
            <a className="hover:text-slate-600 transition" href="#">
              Contact us
            </a>
            <a className="hover:text-slate-600 transition" href="#">
              Privacy policy
            </a>
          </div>
        </div>

        {/* Subscribe Section */}
        <div className="flex flex-col items-center">
          <h2 className="font-semibold mb-5 text-gray-800">
            Subscribe to our Website - Stay
          </h2>
          <p className="text-sm text-gray-600 max-w-xs">
            The latest news and resources, sent to your inbox weekly.
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer
