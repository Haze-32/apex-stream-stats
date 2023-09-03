import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { signOut } from "firebase/auth";
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import { useAuth } from '../utilities/AuthContext'; // Import the custom hook

export default function NavigationBar() {
    const navigate = useNavigate();

    // Use the AuthContext
    const { isLoggedIn, email, setIsLoggedIn, setEmail } = useAuth();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('apexTrackerUser'));
        if (storedUser) {
            setIsLoggedIn(true);
            setEmail(storedUser.email);
        } else {
            setIsLoggedIn(false);
            setEmail(null);
        }
    }, []);

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                localStorage.removeItem('apexTrackerUser');
                // Reset shared state
                setIsLoggedIn(false);
                setEmail(null);
                navigate('/login');
            })
            .catch((error) => {
                console.error("Error signing out: ", error);
            });
    };

    return (
        <>
            <header>
                <Navbar className="plex-navbar" expand="lg">
                    <Container fluid>
                        <Navbar.Brand>
                            <Link className="navbar-brand" to="/">Home</Link>
                        </Navbar.Brand>
                        <Nav className="ms-auto mb-2 mb-lg-0 profile-menu">
                            <div className="nav-controls">
                                {isLoggedIn ? (
                                    <>
                                        <NavDropdown
                                            id="navbarDropdown"
                                            title={<i className="bi bi-person-circle">text</i>}
                                            menuVariant="dark"
                                        >
                                            <NavDropdown.Item disabled>
                                                <span>{email}</span>
                                            </NavDropdown.Item>
                                            <NavDropdown.Item onClick={handleLogout}>
                                                <i className="bi bi-door-closed"></i> Logout
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                    </>
                                ) : (
                                    <Button className="me-3" onClick={handleLoginClick}>
                                        Login
                                    </Button>
                                )}
                            </div>
                        </Nav>
                    </Container>
                </Navbar>
            </header>
        </>
    );
}