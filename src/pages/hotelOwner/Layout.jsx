import React from 'react'
import Navbar from '../../components/hotelOwner/Navbar'
import Sidebar from '../../components/hotelOwner/Sidebar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='flex min-h-screen flex-col bg-slate-50'>
      <Navbar/>
      <div className='flex flex-1 flex-col lg:flex-row'>
        <Sidebar/>
        <div className='flex-1 p-4 pt-6 md:px-8 lg:px-10 lg:pt-10'>
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default Layout 
