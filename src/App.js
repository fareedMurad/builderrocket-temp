import React from 'react';
import Routes from './Routes';
import { Container } from 'react-bootstrap';
import './App.scss';

// components
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
    return (
        <div>
            <Header />
            <Container className='routes-container'>
                <Routes />
            </Container>
            <Footer />
        </div>
    );
}

export default App;
