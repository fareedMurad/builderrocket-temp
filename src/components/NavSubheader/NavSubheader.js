import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './NavSubheader.scss';

const NavSubheader = () => {

    return (
        <Navbar expand='lg' className='nav-bar'>
            <Container>
                <Nav className='ml-4 pl-2 mr-auto'>
                    <Link className='header-item' to='/'>
                        <i className='far fa-images fa-sm tab-icon'></i>
                        Projects
                    </Link>
                    <Link className='header-item' to='home'>
                        <i className='far fa-border-none fa-sm tab-icon'></i>
                        Rooms Management
                    </Link>
                    <Link className='header-item' to='/features'>
                        <i className='far fa-lightbulb fa-sm tab-icon'></i>
                        Utility Management
                    </Link>
                    <Link className='header-item' to='/pricing'>
                        <i className='far fa-bookmark fa-sm tab-icon'></i>
                        Vendor Management
                    </Link>
                    <Link className='header-item' to='/home'>
                        <i className='far fa-user-hard-hat fa-sm tab-icon'></i>
                        Contractor Management
                    </Link>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default NavSubheader;