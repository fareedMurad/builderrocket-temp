import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import './NavSubheader.scss';

const NavSubheader = () => {
    const history = useHistory();

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    const setDimension = () => {
        setScreenWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', setDimension);

        return (() => {
            window.removeEventListener('resize', setDimension);
        })
    }, [screenWidth]);

    if (screenWidth > 767 & screenWidth < 992) {
        return (
            <Navbar className='nav-bar-subheader'>
                <Container>
                    <Nav id='nav-dropdown'>
                        <div
                            className='header-item'
                            onClick={() => history.push('/')}
                        >
                            Projects
                        </div>
                        <NavDropdown title='Management' id='management-dropdown'>
                            <NavDropdown.Item>Rooms Management</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => history.push('/utility-management')}>Utility Management</NavDropdown.Item>
                            <NavDropdown.Item>Vendor Management</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => history.push('/contractor-management')}>Contractor Management</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>
        )
    }

    return (
        <Navbar collapseOnSelect expand='md' className='nav-bar-subheader'>
            <Container>
                <Navbar.Toggle aria-controls='nav-bar' />
                <Navbar.Collapse>
                    <Nav className='mr-auto'>
                        <div
                            className='header-item'
                            onClick={() => history.push('/')}
                        >
                            <i className='far fa-images fa-sm tab-icon'></i>
                            Projects
                        </div>
                        <div className='header-item'
                            onClick={() => history.push('/rooms-management/roomTypes')}>
                            <i className='far fa-border-none fa-sm tab-icon'></i>
                            Rooms Management
                        </div>
                        <div
                            className='header-item'
                            onClick={() => history.push('/utility-management')}
                        >
                            <i className='far fa-lightbulb fa-sm tab-icon'></i>
                            Utility Management
                        </div>
                        <div className='header-item'>
                            <i className='far fa-bookmark fa-sm tab-icon'></i>
                            Vendor Management
                        </div>
                        <div
                            className='header-item'
                            onClick={() => history.push('/contractor-management')}
                        >
                            <i className='far fa-user-hard-hat fa-sm tab-icon'></i>
                            Contractor Management
                        </div>
                        <div className='header-item'>
                            <i className='far fa-house-day fa-sm tab-icon'></i>
                            Subdivision Management
                        </div>
                        <div className='header-item' onClick={() => history.push('/my-products-management')}>
                            <i className='fa fa-product-hunt fa-sm tab-icon'></i>
                            My Products
                        </div>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );

    return null
}

export default NavSubheader;