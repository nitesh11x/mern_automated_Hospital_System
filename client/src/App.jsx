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
import EmergencyButton from './components/section/EmergencyButton';

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
import PatientDetail from './components/patient/PatientDetail';
import DoctorScheduel from './components/doctor/DoctorScheduel';
import AppointmentDetail from './components/appointment/AppointmentDetail';
import BookingOptions from './components/common/BookingOptions';
import RegisterByAdmin from './components/patient/RegisterByAdmin';
import BookAppointmentByAdmin from './components/appointment/BookAppointmentByAdmin';

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
          <Route path='/booking-options' element={<BookingOptions />}></Route>
          <Route path='/register-x' element={<AdminRoute> <RegisterByAdmin /></AdminRoute>}></Route>

          {/* patient routes  */}
          <Route path='/patient/login' element={<Login />}></Route>
          <Route path='/patient/register' element={<Register />}></Route>
          <Route path='/patient/dashboard' element={<PatientRoute><Dashboard /></PatientRoute>}></Route>
          <Route path='/patient/me' element={<PatientRoute><Profile /></PatientRoute>}></Route>
          <Route path='/patient/all' element={<AdminRoute><Patients /></AdminRoute>}></Route>
          <Route path='/patient/manage' element={<AdminRoute><PatientManage /></AdminRoute>}></Route>
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
