import React, { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './NavSubheader.scss';

// components
import AddUtility from '../AddUtility';

const NavSubheader = () => {
    const [showUtility, setShowUtility] = useState(false);

    const handleModal = () => {
        setShowUtility(!showUtility);
    }


    return (
        <Navbar expand='lg' className='nav-bar'>
            <Container>
                <Nav className='ml-4 pl-2 mr-auto'>
                    <div className='header-item'>
                        <i className='far fa-images fa-sm tab-icon'></i>
                        Projects
                    </div>
                    <div className='header-item'>
                        <i className='far fa-border-none fa-sm tab-icon'></i>
                        Rooms Management
                    </div>
                    <div 
                        className='header-item' 
                        onClick={handleModal}
                    >
                        <i className='far fa-lightbulb fa-sm tab-icon'></i>
                        Utility Management
                    </div>
                    <div className='header-item'>
                        <i className='far fa-bookmark fa-sm tab-icon'></i>
                        Vendor Management
                    </div>
                    <div className='header-item'>
                        <i className='far fa-user-hard-hat fa-sm tab-icon'></i>
                        Contractor Management
                    </div>
                </Nav>
            </Container>

            {showUtility && 
                <AddUtility 
                    show={showUtility} 
                    handleClose={handleModal} 
                />
            }
        </Navbar>
    );
}

export default NavSubheader;