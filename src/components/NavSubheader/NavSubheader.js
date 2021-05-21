import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import './NavSubheader.scss';

const NavSubheader = () => {
    const history = useHistory();

    return (
        <Navbar expand='lg' className='nav-bar'>
            <Container>
                <Nav className='ml-4 pl-2 mr-auto'>
                    <div 
                        className='header-item' 
                        onClick={() => history.push('/')}
                    >
                        <i className='far fa-images fa-sm tab-icon'></i>
                        Projects
                    </div>
                    <div className='header-item'>
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
                </Nav>
            </Container>
        </Navbar>
    );
}

export default NavSubheader;