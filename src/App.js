import React, {useEffect, useState} from 'react';
import Routes from './Routes';
import { Container } from 'react-bootstrap';
import './App.scss';

// components
import Header from './components/Header';
import Footer from './components/Footer';

function App() {

    const [expandedNav, setExpandedNav] = useState(false);


    useEffect(() => {
        window.addEventListener('resize', () => {
            if(window.innerWidth  >= 860){
                setExpandedNav(false)
            }
        });
        
        return(() => {
            window.removeEventListener('resize');
        })
    }, []);

    useEffect

    return (
        <div>
            <Header expanded={expandedNav} setExpanded={setExpandedNav}/>
            <Container className={`routes-container ${expandedNav ? 'blur' : ''}`}>
                <Routes />
            </Container>
            <Footer />
        </div>
    );
}

export default App;
