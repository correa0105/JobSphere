import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

export default function PrivateRoute({ children }) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const { pathname } = useLocation();

  return isLoggedIn ? children : <Navigate to="/login" state={pathname} />;
}

PrivateRoute.propTypes = {
  children: PropTypes.element.isRequired,
};
