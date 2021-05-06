import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { logout } from '../../actions/authActions';
import './Header.scss';

import NavSubheader from '../NavSubheader';

import Logo from '../../assets/images/builder-rocket-logo.png';

const Header = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout())  
            .then(() => {
                history.push('/login');
            });
    }

    return (
        <>
            <Navbar expand='lg' bg='dark' className='header'>
                <Navbar.Brand href='/' className='brand'>
                    <img src={Logo} alt='builder rocket' height='45' width='100' />
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
                    <Nav.Link className='item' onClick={handleLogout}>
                        <i className='far fa-sign-out-alt'></i>
                    </Nav.Link>
                </Navbar.Collapse>
            </Navbar>

            <NavSubheader />
        </>
    )
}

export default Header;