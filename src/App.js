import React from 'react';
import Routes from './Routes';
import './App.scss';

// components
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
    return (
        <div>
            <Header />
            <div className='routes-container'>
                <Routes />
            </div>
            <Footer />
        </div>
    );
}

export default App;
