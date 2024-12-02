import React from 'react';
import { Routes, Route } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';

import Login from '../pages/Login';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import EmployerCreate from '../pages/EmployerCreate';
import JobsCreate from '../pages/JobsCreate';
import TotalPerLocation from '../pages/TotalPerLocation';
import TotalPerEmployer from '../pages/TotalPerEmployer';
import JobsByDate from '../pages/JobsByDate';
import JobEdit from '../pages/JobEdit';

export default function ContainerRoutes() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/dashboard" element={<Dashboard />} />
      <Route exact path="/login" element={<Login />} />
      <Route
        exact
        path="/employer/create"
        element={
          <PrivateRoute>
            <EmployerCreate />
          </PrivateRoute>
        }
      />
      <Route
        exact
        path="/job/create"
        element={
          <PrivateRoute>
            <JobsCreate />
          </PrivateRoute>
        }
      />
      <Route
        exact
        path="/job/totalPerLocation"
        element={
          <PrivateRoute>
            <TotalPerLocation />
          </PrivateRoute>
        }
      />
      <Route
        exact
        path="/job/totalPerEmployer"
        element={
          <PrivateRoute>
            <TotalPerEmployer />
          </PrivateRoute>
        }
      />
      <Route
        exact
        path="/job/findAll"
        element={
          <PrivateRoute>
            <JobsByDate />
          </PrivateRoute>
        }
      />
      <Route
        exact
        path="/job/:id"
        element={
          <PrivateRoute>
            <JobEdit />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
