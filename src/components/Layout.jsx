import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import { mediaConfig } from '../data/mediaConfig'

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#141414]">
      <Navbar brandName={mediaConfig.brandName} />
      <Outlet />
    </div>
  )
}
