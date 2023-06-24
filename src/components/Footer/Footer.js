import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.scss';


const Footer = () => {
    const appVersion = typeof process !== 'undefined' && process.env ? 'v' + process.env.NODE_ENV : null;

    return (
        <Navbar className='footer justify-content-center'>  
            <Nav>
                <Link className='footer-item' to='/'>Copyright</Link>
                <Link className='footer-item' to='/'>Social Media</Link>
                <Link className='footer-item' to='/'>Contact Us</Link>
            </Nav>
            <span className='float-right'>{appVersion}</span>
        </Navbar>
    )
}

export default Footer;
