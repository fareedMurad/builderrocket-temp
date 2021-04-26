import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.scss';


const Footer = () => {

    return (
        <Navbar className='footer justify-content-center'>  
            <Nav>
                <Link className='footer-item'>Copyright</Link>
                <Link className='footer-item'>Social Media</Link>
                <Link className='footer-item'>Contact Us</Link>
            </Nav>
        </Navbar>
    )
}

export default Footer;