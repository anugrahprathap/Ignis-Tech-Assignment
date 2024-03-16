import React, { useState, useEffect } from "react";
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faLocationDot, faPlus, faTicket } from '@fortawesome/free-solid-svg-icons'; 
import { faUser } from '@fortawesome/free-regular-svg-icons'; 
import axios from 'axios';
import { faHeart } from '@fortawesome/free-regular-svg-icons'; 
import Dropdown from 'react-bootstrap/Dropdown';
import Logo from "./Logo";

const Navbar = () => {
    const [userData, setUserData] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Fetch user data only if token exists
        if (token) {
            axios.get('http://127.0.0.1:8000/api/user/', {
                headers: {
                    Authorization: `Token ${token}`
                }
            })
            .then(response => {
                // Update the state with the user data
                setUserData(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
        }
    }, [token]); // Fetch user data when token changes

    const handleLogout = () => {
        // Clear token from local storage and reload the page
        localStorage.removeItem('token');
        window.location.reload();
    };

    return (
        <div className="navbar navbar-expand-lg navbar-light bg-light ">
            <div className="container-fluid ">

                <a className="navbar-brand " href="/" style={{height:'50px'}} >
                <Logo />
                </a>
                
                <div className="search">
                    <div className="search-icon">
                        <FontAwesomeIcon className="icon" icon={faMagnifyingGlass} />
                        Search
                    </div>
                    <div className="location">
                        <FontAwesomeIcon className='loc' icon={faLocationDot} /> Cochin
                    </div>
                </div>
                <div className="links">
                    {localStorage.getItem('token') ? (
                        <>
                            {userData && 
                            <div className="user-items">
                            <span style={{marginLeft:'10px', display:'flex', flexDirection:'column'}}>
                            <FontAwesomeIcon icon={faPlus} />
                             Create an event</span>
                             <a href="/liked-events" className="text-decoration-none" style={{color: '#39364F'}}>
                             <span  style={{marginLeft:'10px', display:'flex', flexDirection:'column'}}>
                            <FontAwesomeIcon icon={faHeart} className="mr-2" />
                            Likes</span>
                             </a>
                            
                            <span style={{marginLeft:'10px', display:'flex', flexDirection:'column'}}>
                            <FontAwesomeIcon icon={faTicket} />
                            Tickets</span>
                            <Dropdown>
                                <Dropdown.Toggle variant="light" id="dropdown-basic" style={{ marginLeft: '10px', cursor: 'pointer' }}>
                                    <FontAwesomeIcon icon={faUser} style={{ marginRight: '5px' }} /> {userData.email}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                    <Dropdown.Item >Likes</Dropdown.Item>
                                </Dropdown.Menu>
                                
                            </Dropdown>
                            </div>
                            }
                        </>
                    ) : (
                        <>
                            {/* <a href='' className="text-decoration-none ancor"><span>Find Events</span></a> */}
                            <a href='' className="text-decoration-none ancor"><span>Create Events</span></a>
                            <a href='' className="text-decoration-none ancor "><span>Help Center</span></a>
                            <a href='/login' className="text-decoration-none ancor"><span>Log In</span></a>
                            <a href='/signup' className="text-decoration-none ancor"><span>Sign Up</span></a>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Navbar;
