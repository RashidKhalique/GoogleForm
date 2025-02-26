import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const url = new URL(location.href);
  localStorage.setItem("url", url.pathname);
  
  useEffect(() => {
    if (!token) {
      toast.error("Login First ...");

        navigate("/");

    }
  }, [navigate, token]);

  return (
    <>
      <ToastContainer />
      {children}
    </>
  );
};

export default PrivateRoute;
