import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.scss';


const Footer = () => {

    return (
        <Navbar className='footer justify-content-center'>  
            <Nav>
                <Link className='footer-item' to='/'>Copyright</Link>
                <Link className='footer-item' to='/'>Social Media</Link>
                <Link className='footer-item' to='/'>Contact Us</Link>
            </Nav>
        </Navbar>
    )
}

export default Footer;