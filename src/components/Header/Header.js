import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Navbar, Nav, Image } from 'react-bootstrap';
import { logout } from '../../actions/authActions';
import './Header.scss';

import NavSubheader from '../NavSubheader';

import Logo from '../../assets/images/builder-rocket-logo.png';

const Header = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const user = useSelector(state => state.user.user);

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
                        {user?.avatarURL ?
                            <Image src={user?.avatarURL} roundedCircle />
                        :
                            <i className='far fa-user-circle'></i>
                        }
                    </Nav.Link>
                    <Nav.Link className='item'>
                        <i className='far fa-cog'></i>
                    </Nav.Link>
                    {user?.firstName &&
                        <Navbar.Text className='item'>
                            {user?.firstName}
                        </Navbar.Text>
                    }
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