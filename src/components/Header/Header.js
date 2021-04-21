import React from 'react';
import { Navbar, Form, Container, Nav } from 'react-bootstrap';
import './Header.scss';

import NavSubheader from '../NavSubheader';

const Header = () => {

    return (
        <>
            <Navbar expand='lg' bg='dark' className='header'>

                <Container>
                    <Navbar.Brand className='brand'>
                        <b>BuilderRocket</b>
                    </Navbar.Brand>
                </Container>

                <Navbar.Collapse className='responsive-navbar-nav'>
                    <Nav>
                        <i className='far fa-user-circle'></i>
                        <i className='far fa-cog'></i>
                        <i className='far fa-sign-out-alt'></i>
                    </Nav>
                    <Form inline>
                    </Form>
                </Navbar.Collapse>

            </Navbar>
            <NavSubheader />
        </>
    )
}

export default Header;