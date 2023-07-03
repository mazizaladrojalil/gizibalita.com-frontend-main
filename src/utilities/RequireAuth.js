import React, { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const RequireAuth = ({allowedRoles}) => {
    const auth  = JSON.parse(`${localStorage.getItem("login_data")}`);
    const location = useLocation();
    console.log(auth)
    console.log(JSON.parse(`${localStorage.getItem("login_data")}`))

    useEffect(() => {
        if(!auth) return <Navigate to="/" state={{from: location}} replace/>

        const isvalid = allowedRoles?.includes(auth?.user?.role)

        if (auth && !isvalid) {
            return <Navigate to="/destroy" state={{from: location}} replace/>
        }
    }, [location.pathname, auth])
    return (
       <Outlet/>
  )
}

export default RequireAuth
