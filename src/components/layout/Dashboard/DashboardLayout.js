import React, { useEffect, useState } from 'react'
import bgAdmin from "../../../assets/img/bgAdmin.svg"
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import "./Style.css"
import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {
     const [showSidebar, setShowSidebar] = useState(true);

    useEffect(() => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (isMobile) {
        setShowSidebar(false);
        }
        const resizeEvent = window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            setShowSidebar(false);
        } else {
            setShowSidebar(true);
        }
        });
        return () => {
        window.removeEventListener('resize', resizeEvent);
        };
    }, []);

    const navbarLinks = [
        {
            name: 'Home',
            path: '/dashboard',
        },
        {
            name: 'Register Akun',
            path: '/dashboard/data-balita',
        },
        {
            name: 'Tenaga Kesehatan',
            path: '/dashboard/data-balita',
        }
    ];

  return (
    <>
        <div className="flex w-full min-h-screen" 
         style={
                {background: `url(${bgAdmin})`, color:"#b41318", backgroundPosition: "right 0px top 0px"}
            }>
            <Sidebar showSidebar={showSidebar} />
            <div
                className={`flex flex-col w-full duration-300 ${
                    showSidebar ? 'ml-60 max-w-dashboard-content' : 'ml-0'
                }`}
            >
                <Navbar navbarLink={navbarLinks}/>
                <div className="ml-28 mt-4 pr-8 pb-8">
                    <Outlet />
                </div>
            </div>
        </div>
    </>
  )
}

export default DashboardLayout
