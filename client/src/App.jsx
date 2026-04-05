import './App.css'
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { adminProfileThunk } from './redux/slices/admin.slice';
import { profilePatientThunk } from './redux/slices/patient.slice';
import { profileDoctorThunk } from './redux/slices/doctor.slice';

import Hero from './components/Home/Hero'
import Navbar from './components/common/Navbar'
import Contact from './components/section/Contact'
import About from './components/section/About'
import Footer from './components/common/Footer'
import OtpForm from './components/common/OtpForm';
import Services from './components/section/Services';
import LoginDashboard from './components/common/LoginDashboard';

import Profile from './components/patient/PatientDetail'
import Login from './components/patient/Login'
import Register from './components/patient/Register'
import Dashboard from './components/patient/Dashboard'
import Patients from './components/patient/Patients';
import PatientManage from './components/patient/PatientManage';
import PatientRoute from './utils/PatientRoute';


import AdminDetail from './components/admin/AdminDetail';
import AdminLogin from './components/admin/AdminLogin';
import AdminProfile from './components/admin/AdminProfile';
import AdminRegister from './components/admin/AdminRegister';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminRoute from './utils/AdminRoute';

import Doctors from './components/doctor/Doctors'
import DoctorRegister from './components/doctor/DoctorRegister';
import DoctorDashboard from './components/doctor/DoctorDashboard';
import DoctorDetail from './components/doctor/DoctorDetail';
import DoctorProfile from './components/doctor/DoctorProfile';
import DoctorLogin from './components/doctor/DoctorLogin';
import DoctorManage from './components/doctor/DoctorManage';


import BookAppointment from './components/appointment/BookAppointment';
import ShowAppointments from './components/appointment/ShowAppointments';
import BookAppointmentOfSpecificDoctor from './components/appointment/BookAppointmentOfSpecificDoctor';
import DoctorRoute from './utils/DoctorRoute';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(adminProfileThunk());
  }, [dispatch]);
  useEffect(() => {
    dispatch(profileDoctorThunk());
  }, []);
  useEffect(() => {
    dispatch(profilePatientThunk());
  }, []);

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
          <Route path='/otp-form' element={<OtpForm />}></Route>
          <Route path='/management' element={<LoginDashboard />}></Route>
          <Route path='/services' element={<Services />}></Route>

          {/* patient routes  */}
          <Route path='/patient/login' element={<Login />}></Route>
          <Route path='/patient/register' element={<Register />}></Route>
          <Route path='/patient/dashboard' element={<PatientRoute><Dashboard /></PatientRoute>}></Route>
          <Route path='/patient/me' element={<PatientRoute><Profile /></PatientRoute>}></Route>
          <Route path='/patient/all' element={<AdminRoute><Patients /></AdminRoute>}></Route>
          <Route path='/patient/manage' element={<AdminRoute><PatientManage /></AdminRoute>}></Route>
          <Route path='/patient/:patientId' element={<Profile />}></Route>

          {/* doctor routes  */}
          <Route path='/doctor/login' element={<DoctorLogin />}></Route>
          <Route path='/doctor/register' element={<AdminRoute><DoctorRegister /></AdminRoute>}></Route>
          <Route path='/doctor/dashboard' element={<DoctorDashboard />}></Route>
          <Route path='/doctor/all' element={<Doctors />}></Route>
          <Route path='/doctor/all/:id' element={< DoctorDetail />}></Route >
          <Route path='/doctor/:id' element={<DoctorRoute><DoctorProfile /></DoctorRoute>}></Route>
          <Route path='/doctor/detail' element={<DoctorDetail />}></Route>
          <Route path='/doctor/manage' element={<AdminRoute><DoctorManage /></AdminRoute>}></Route>

          {/* admin routes  */}
          <Route path='/admin/login' element={<AdminLogin />}></Route >
          <Route path='/admin/register' element={<AdminRoute><AdminRegister /></AdminRoute>}></Route >
          <Route path='/admin/dashboard' element={<AdminRoute><AdminDashboard /></AdminRoute>}></Route >
          <Route path='/admin/detail' element={<AdminRoute><AdminDetail /></AdminRoute>}></Route >
          <Route path='/admin/:id' element={<AdminRoute><AdminProfile /></AdminRoute>}></Route >


          {/* appointment routes  */}
          <Route path='/appointment/book' element={<PatientRoute><BookAppointment /> </PatientRoute>}></Route >
          <Route path='/appointment/book/:doctorId' element={<PatientRoute><BookAppointmentOfSpecificDoctor /> </PatientRoute>}></Route >
          <Route path='/appointment/all' element={<AdminRoute><ShowAppointments /></AdminRoute>}></Route >


          {/* reviews routes  */}


          {/*  routes  */}

        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
