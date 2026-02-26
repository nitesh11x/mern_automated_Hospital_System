// PatientRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PatientRoute = ({ children }) => {
  const { isPatientAuthenticated } = useSelector(state => state.patient);

  if (!isPatientAuthenticated) {
    return <Navigate to="/patient/login" replace />;
  }

  return children;
};

export default PatientRoute;