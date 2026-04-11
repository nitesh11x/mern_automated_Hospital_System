import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const DoctorRoute = ({ children }) => {
    const { isDoctortAuthenticated } = useSelector(state => state.doctor);

    if (!isDoctortAuthenticated) {
        return <Navigate to="/doctor/login" replace />;
    }

    return children;
};

export default DoctorRoute;