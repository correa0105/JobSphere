import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { toast } from 'react-toastify';

import * as actions from '../../store/modules/auth/actions';

import Logo from '../../assets/img/logo.png';

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const handleLogout = (event) => {
    event.preventDefault();
    dispatch(actions.loginFailure());
    toast.error('You logged out!');
    navigate('/');
  };

  return (
    <Navbar className="bg-secondary px-2" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand className="d-flex align-items-center gap-2">
          <img src={Logo} alt="Logotipo" width="26px" />
          JobSphere
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="w-100">
            {!isLoggedIn && (
              <Link to="/" className="nav-link">
                Home
              </Link>
            )}
            <div className="d-flex flex-column flex-lg-row ms-lg-auto">
              {isLoggedIn ? (
                <>
                  <Link to="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                  <NavDropdown title="Reports" id="basic-nav-dropdown">
                    <Link to="/job/findAll" className="dropdown-item">
                      All Works
                    </Link>
                    <Link to="/job/totalPerLocation" className="dropdown-item">
                      Work Per Location
                    </Link>
                    <Link to="/job/totalPerEmployer" className="dropdown-item">
                      Work Per Employer
                    </Link>
                  </NavDropdown>
                  <NavDropdown title="Registers" id="basic-nav-dropdown">
                    <Link to="/job/create" className="dropdown-item">
                      Register Work
                    </Link>
                    <Link to="/employer/create" className="dropdown-item">
                      Register Employer
                    </Link>
                  </NavDropdown>
                  <Link to="/logout" onClick={handleLogout} className="nav-link">
                    Exit
                  </Link>
                </>
              ) : (
                <Link to="/login" className="nav-link">
                  Entry
                </Link>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
