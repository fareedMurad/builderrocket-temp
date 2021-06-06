import React from 'react';
import { useHistory } from 'react-router-dom';
import { Navbar, Nav, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions/authActions';
import './Header.scss';

// components
import NavSubheader from '../NavSubheader';

import Logo from '../../assets/images/builder-rocket-logo.png';

const Header = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const user = useSelector(state => state.user.user);
    const isSignedIn = useSelector(state => state.auth.isSignedIn);

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
                {isSignedIn &&
                    <Navbar.Collapse className='justify-content-end'>
                        <Nav.Link className='item'>
                            {user?.AvatarURL ?
                                <Image src={user?.AvatarURL} roundedCircle />
                            :
                                <i className='far fa-user-circle'></i>
                            }
                        </Nav.Link>
                        <Nav.Link className='item'>
                            <i className='far fa-cog'></i>
                        </Nav.Link>
                        {user?.FirstName ?
                            <Navbar.Text className='item'>
                                {user?.FirstName} {user?.LastName}
                            </Navbar.Text>
                        : 
                            <Navbar.Text className='item'>
                                {user?.Company}
                            </Navbar.Text>
                        }
                        <Nav.Link className='item' onClick={handleLogout}>
                            <i className='far fa-sign-out-alt'></i>
                        </Nav.Link>
                    </Navbar.Collapse>
                }
            </Navbar>

            {isSignedIn && 
                <NavSubheader />
            }
        </>
    )
}

export default Header;