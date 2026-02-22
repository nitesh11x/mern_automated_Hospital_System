import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from "react-hot-toast";
import Hero from './components/Home/Hero'
import Navbar from './components/common/Navbar'
import Login from './components/patient/Login'
import Register from './components/patient/Register'
import Dashboard from './components/patient/Dashboard'
import Profile from './components/patient/Profile'
import Doctors from './components/doctor/Doctors'
import Contact from './components/section/Contact'
import About from './components/section/About'
import Footer from './components/common/Footer'
import OtpForm from './components/common/OtpForm';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminDetail from './components/admin/AdminDetail';
import AdminLogin from './components/admin/AdminLogin';
import AdminProfile from './components/admin/AdminProfile';
import AdminRegister from './components/admin/AdminRegister';
import DoctorRegister from './components/doctor/DoctorRegister';
import DoctorDashboard from './components/doctor/DoctorDashboard';
import DoctorDetail from './components/doctor/DoctorDetail';
import DoctorProfile from './components/doctor/DoctorProfile';

function App() {


  return (
    <>
      <BrowserRouter>
        <Toaster position="top-right" reverseOrder />
        <Navbar />
        <Routes>
          {/* Basic Routes  */}
          <Route path='/' element={<Hero />}></Route>
          <Route path='/about' element={<About />}></Route>
          <Route path='/contact' element={<Contact />}></Route>
          <Route path='/login' element={<OtpForm />}></Route>

          {/* patient routes  */}
          <Route path='/patient/login' element={<Login />}></Route>
          <Route path='/patient/register' element={<Register />}></Route>
          <Route path='/patient/dashboard' element={<Dashboard />}></Route>
          <Route path='/patient/me' element={<Profile />}></Route>

          {/* doctor routes  */}
          <Route path='/doctor/login' element={<Doctors />}></Route>
          <Route path='/doctor/register' element={<DoctorRegister />}></Route>
          <Route path='/doctor/dashboard' element={<DoctorDashboard />}></Route>
          <Route path='/doctor/all' element={<Doctors />}></Route>
          <Route path='/doctor/:id' element={<DoctorProfile />}></Route>
          <Route path='/doctor/detail' element={<DoctorDetail />}></Route>

          {/* admin routes  */}
          <Route path='/admin/login' element={<AdminLogin />}></Route >
          <Route path='/admin/register' element={<AdminRegister />}></Route >
          <Route path='/admin/dashboard' element={<AdminDashboard />}></Route >
          <Route path='/admin/detail' element={<AdminDetail />}></Route >
          <Route path='/admin/:id' element={<AdminProfile />}></Route >


          {/* appointment routes  */}


          {/* reviews routes  */}


          {/*  routes  */}

        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
