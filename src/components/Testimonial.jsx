import React from 'react'
import Title from './Title'
import { testimonials } from '../assets/assets'
import StarRating from './StarRating'

const Testimonial = () => {
  return (
    <div className='flex flex-col items-center bg-slate-50 px-4 pb-20 pt-16 sm:px-6 md:px-12 lg:px-20'>
      <Title title="What Our Guest Say" subTitle=" Discover why discrening travelers consistently choose
      for execlusive and luxurious accommodations around the world"/>

      <div className="mt-12 flex w-full flex-wrap items-stretch justify-center gap-6">
  {testimonials.map((testimonial) => (
    <div
      key={testimonial.id}
      className="w-full max-w-sm rounded-2xl bg-white p-6 shadow"
    >
      <div className="flex items-center gap-3">
        <img
          className="w-12 h-12 rounded-full"
          src={testimonial.image}
          alt={testimonial.name}
        />
        <div>
          <p className="font-playfair text-xl">
            {testimonial.name}
          </p>
          <p className="text-gray-500">
            {testimonial.address}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 mt-4">
        <StarRating/>
      </div>

      <p className="mt-4 text-sm leading-6 text-gray-500 sm:text-base">
        {testimonial.review}
      </p>
    </div>
  ))}
</div>
    </div>
  )
}

export default Testimonial
