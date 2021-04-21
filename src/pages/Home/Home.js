import React, { useEffect, useState } from 'react';
import { Button, Container, Row } from 'react-bootstrap';
import { getProperties } from '../../data.js';
import './Home.scss';

// components 
import ProjectCard from '../../components/ProjectCard';

const Home = () => {
    
    const [properties, setProperties] = useState();

    useEffect(() => {
        getProperties()
            .then((response) => {
                setProperties(response);
            });
    })

    console.log('properties', properties);

    return (
        <Container className='home'>
                <div className='d-flex title-container'>
                    <div id='home-title'>Projects</div>
                    <Button variant='link' className='link-btn'>+ Add Project</Button>
                </div>
                <div className='d-flex project-tabs'>
                    <div>
                        <a className='link-btn' href='/'>Active Projects</a>
                    </div>
                    <div id='splitter'>{' | '}</div>
                    <div>
                        <a className='link-btn' href='/'>Closed Projects</a>
                    </div>
                </div>

                <Row className='cards' noGutters={true}>
                    {properties?.map((project, index) => (
                        <ProjectCard key={index} project={project} />
                    ))}
                </Row>
        </Container>
    );
}

export default Home;