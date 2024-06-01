import React, { useContext, useEffect } from 'react';
import { MyContext } from '../context/context';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(MyContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      navigate("/login");
    }
  }, [auth, navigate]);

  return auth ? children : null;
}

export default ProtectedRoute;
