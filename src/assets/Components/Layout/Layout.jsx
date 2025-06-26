import React from 'react'
import Navbar from '../Navbar/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../../SmallComponents/Footer/Footer'


export default function Layout() {
  return (
    <>
    <Navbar/>
    <Outlet/>
    </>
  )
}
