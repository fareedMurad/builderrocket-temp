import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './NavSubheader.scss';

const NavSubheader = () => {

    return (
        <Navbar expand='lg' className='nav-bar'>
            <Container>
                <Nav className='mr-auto'>
                    <Link className='header-item' href='home'>
                        <i className='far fa-images fa-sm tab-icon'></i>
                        Projects
                    </Link>
                    <Link className='header-item' href='home'>
                        <i className='far fa-border-none fa-sm tab-icon'></i>
                        Rooms Management
                    </Link>
                    <Link className='header-item' href='features'>
                        <i className='far fa-lightbulb fa-sm tab-icon'></i>
                        Utility Management
                    </Link>
                    <Link className='header-item' href='pricing'>
                        <i className='far fa-bookmark fa-sm tab-icon'></i>
                        Vendor Management
                    </Link>
                    <Link className='header-item' href='home'>
                        <i className='far fa-user-hard-hat fa-sm tab-icon'></i>
                        Contractor Management
                    </Link>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default NavSubheader;