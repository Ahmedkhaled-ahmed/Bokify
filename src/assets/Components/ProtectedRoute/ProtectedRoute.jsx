import React, { useEffect, useState } from 'react'
import Style from "./ProtectedRoute.module.css"
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
  return token ? children : <Navigate to="/login" replace />;
}

