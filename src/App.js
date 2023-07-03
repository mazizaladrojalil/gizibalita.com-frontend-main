import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Desa from "./pages/Desa";
import Detail from "./pages/Detail";
import DetailForum from "./pages/DetailForum";
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Post from "./pages/Post";
import MyPost from "./pages/MyPost";
import NotFound from "./pages/NotFound";
import DashboardAdmin from "./pages/AdminDashboard";
import Artikel from "./pages/Artikel";
import PosyanduDashboard from "./pages/Posyandu";
import DetailPosyandu  from './pages/Posyandu/DetailPosyandu'
import DashboardLayout from "./components/layout/Dashboard/DashboardLayout";
import { ROUTES } from "./utilities/Routes";
import RequireAuth from "./utilities/RequireAuth";

const ROLES = {
  'Desa': "DESA",
  'Posyandu': "KADER_POSYANDU",
  'Admin': "ADMIN",
  'OT': "orang_tua",
  'TK' : "tenaga_kesahatan"
}
function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route
          path="/sign-in/admin"
          element={
            <SignIn
              TenagaKesehatan={false}
              Desa={false}
              kaderPosyandu={false}
              admin={true}
            />
          }
        />
        <Route
          path="/sign-in/tenaga-kesehatan"
          element={
            <SignIn
              TenagaKesehatan={true}
              Desa={false}
              kaderPosyandu={false}
              admin={false}
            />
          }
        />
        <Route
          path="/sign-in/desa"
          element={
            <SignIn
              Desa={true}
              TenagaKesehatan={false}
              kaderPosyandu={false}
              admin={false}
            />
          }
        />
        <Route
          path="/sign-in/kader-posyandu"
          element={
            <SignIn
              kaderPosyandu={true}
              Desa={false}
              TenagaKesehatan={false}
              admin={false}
            />
          }
        />
        <Route path="/sign-up" element={<SignUp />} />
       
        {/* Role Orang_tua */}
        <Route element={<RequireAuth allowedRoles={[ROLES.OT]}/>}>
          <Route path="/dashboard" element={
            <Dashboard />
          } />
          <Route path="/forum" element={<Post />} />
          <Route path="/forum/detail/:id" element={<DetailForum />} />
          <Route path="/my-forum" element={<MyPost />} />
          <Route path="/dashboard/detail/:id" element={<Detail />} />
          <Route path="/tenaga-kesehatan/dashboard" element={<Post />} />
          <Route path="/tenaga-kesehatan/detail/:id" element={<DetailForum />} />
          <Route path="/artikel" element={<Artikel />} />
        </Route>

          {/* Role Admin */}
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]}/>}>
            <Route path="/dashboard/admin" element={<DashboardAdmin />} />
            {/* <Route path="/dashboard/admin" element={<DashboardLayout />}>*/}
          </Route>

          {/* Role Kader Posyandu */}
          <Route element={<RequireAuth allowedRoles={[ROLES.Posyandu]}/>}>
            <Route path="/posyandu/dashboard/" element={<PosyanduDashboard />} />
            <Route path="/posyandu/dashboard/detail/:id" element={<DetailPosyandu />} />
          </Route>

          {/* Role Desa */}
        <Route element={<RequireAuth allowedRoles={[ROLES.Desa]}/>}>
          <Route path="/desa/dashboard" element={<Desa />} />
        </Route>

        <Route path="/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
