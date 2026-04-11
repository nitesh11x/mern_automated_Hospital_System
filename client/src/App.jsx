import './App.css'
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { profilePatientThunk } from './redux/slices/patient.slice';

import Hero from './components/Home/Hero'
import Navbar from './components/common/Navbar'
import Contact from './components/section/Contact'
import About from './components/section/About'
import Footer from './components/common/Footer'
import OtpForm from './components/common/OtpForm';
import Services from './components/section/Services';
import EmergencyButton from './components/section/EmergencyButton';

import Profile from './components/patient/PatientDetail'
import Login from './components/patient/Login'
import Register from './components/patient/Register'
import Dashboard from './components/patient/Dashboard'
import PatientRoute from './utils/PatientRoute';
import PatientDetail from './components/patient/PatientDetail';

import Doctors from './components/doctor/Doctors'
import DoctorDetail from './components/doctor/DoctorDetail';

import BookAppointment from './components/appointment/BookAppointment';
import BookAppointmentOfSpecificDoctor from './components/appointment/BookAppointmentOfSpecificDoctor';
import AppointmentDetail from './components/appointment/AppointmentDetail';
import BookingOptions from './components/common/BookingOptions';

function App() {
  const dispatch = useDispatch();
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
          <Route path='/services' element={<Services />}></Route>
          <Route path='/booking-options' element={<BookingOptions />}></Route>

          {/* patient routes  */}
          <Route path='/patient/login' element={<Login />}></Route>
          <Route path='/patient/register' element={<Register />}></Route>
          <Route path='/patient/dashboard' element={<PatientRoute><Dashboard /></PatientRoute>}></Route>
          <Route path='/patient/me' element={<PatientRoute><Profile /></PatientRoute>}></Route>
          <Route path='/patient/:patientId' element={<PatientDetail />}></Route>

          {/* doctor routes  */}
          <Route path='/doctor/all' element={<Doctors />}></Route>
          <Route path='/doctor/detail/:id' element={< DoctorDetail />}></Route >
          <Route path='/doctor/detail' element={<DoctorDetail />}></Route>

          {/* appointment routes  */}
          <Route path='/appointment/book' element={<PatientRoute><BookAppointment /> </PatientRoute>}></Route >
          <Route path='/appointment/book/:doctorId' element={<PatientRoute><BookAppointmentOfSpecificDoctor /> </PatientRoute>}></Route >
          <Route path='/appointment/:id' element={<AppointmentDetail />}></Route >

        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App;
