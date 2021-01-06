import React from 'react'
import { NavLink as RouterNavLink } from 'react-router-dom'

import {
  Container,
  Navbar,
  Nav,
  Dropdown,
  Button,
} from 'react-bootstrap'

import { useAuth0 } from '@auth0/auth0-react'

const NavBar = () => {
  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
  } = useAuth0();

  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin,
    });

  return (
    <div className="nav-container">
      <Navbar bg="light" expand="md">
        <Container>
          <Navbar.Brand className="logo" />
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav as="ul" className="mr-auto">
              {!isAuthenticated && 
                <Nav.Item as="li">
                  <Nav.Link as={RouterNavLink}
                    to="/"
                    exact
                    activeClassName="router-link-exact-active"
                  >
                    Home
                  </Nav.Link>
                </Nav.Item>
              }
              {isAuthenticated && 
                <Nav.Item as="li">
                  <Nav.Link as={RouterNavLink}
                    to="/people"
                    activeClassName="router-link-exact-active"
                  >
                    People
                  </Nav.Link>
                </Nav.Item>
              }              
            </Nav>
            <Nav className="d-none d-md-block">
              {!isAuthenticated && (
                <Nav.Item>
                  <Button
                    id="qsLoginBtn"
                    color="primary"
                    className="btn-margin"
                    onClick={() => loginWithRedirect()}
                  >
                    Log in
                  </Button>
                </Nav.Item>
              )}
              {isAuthenticated && (
                <Dropdown as={Nav.Item}>
                  <Dropdown.Toggle as={Nav.Link} id="profileDropDown">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="nav-user-profile rounded-circle"
                      width="50"
                    />
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="right">
                    <Dropdown.Header>{user.name}</Dropdown.Header>
                    <Dropdown.Item as={RouterNavLink}
                        to="/profile"
                        exact
                        className="dropdown-profile"
                      >
                      <i className="fa fa-user mr-3" /> Profile
                    </Dropdown.Item>
                    <Dropdown.Item
                      id="qsLogoutBtn"
                      onClick={() => logoutWithRedirect()}
                    >
                    <i className="fa fa-power-off mr-3" /> Log
                      out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Nav>
            {!isAuthenticated && (
              <Nav className="d-md-none">
                <Nav.Item>
                  <Button
                    id="qsLoginBtn"
                    color="primary"
                    block
                    onClick={() => loginWithRedirect({})}
                  >
                    Log in
                  </Button>
                </Nav.Item>
              </Nav>
            )}
            {isAuthenticated && (
              <Nav
                className="d-md-none justify-content-between"
                style={{ minHeight: 170 }}
              >
                <Nav.Item>
                  <span className="user-info">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="nav-user-profile d-inline-block rounded-circle mr-3"
                      width="50"
                    />
                    <h6 className="d-inline-block">{user.name}</h6>
                  </span>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={RouterNavLink}
                    to="/profile"
                    exact
                    activeClassName="router-link-exact-active"
                  >
                    <i className="fa fa-user mr-3" />
                    Profile
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={RouterNavLink}
                    to="#"
                    id="qsLogoutBtn"
                    onClick={() => logoutWithRedirect()}
                  >
                  <i className="fa fa-power-off mr-3" /> 
                    Log out
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  )
}

export default NavBar
