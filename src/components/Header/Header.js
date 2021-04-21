import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import './Header.scss';

import NavSubheader from '../NavSubheader';

const Header = () => {

    return (
        <>
            <Navbar expand='lg' bg='dark' className='header'>
                <Navbar.Brand className='brand'>
                    <b>BuilderRocket</b>
                </Navbar.Brand>

                <Navbar.Toggle />
                <Navbar.Collapse className='justify-content-end'>
                    <Nav.Link className='item'>
                        <i className='far fa-user-circle'></i>
                    </Nav.Link>
                    <Nav.Link className='item'>
                        <i className='far fa-cog'></i>
                    </Nav.Link>
                    <Navbar.Text className='item'>
                        South Chase Custom Homes (Contractor)
                    </Navbar.Text>
                    <Nav.Link className='item'>
                        <i className='far fa-sign-out-alt'></i>
                    </Nav.Link>
                </Navbar.Collapse>
            </Navbar>

            <NavSubheader />
        </>
    )
}

export default Header;