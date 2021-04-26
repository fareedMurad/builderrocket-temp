import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Container, Row, Col, Form, FormControl } from 'react-bootstrap';
// import { login } from '../../actions/authActions';
import { getProperties } from '../../data.js';
import { Link } from 'react-router-dom';
import './Home.scss';

// components 
import ProjectCard from '../../components/ProjectCard';

const Home = () => {
    const dispatch = useDispatch();
    
    const [properties, setProperties] = useState();

    useEffect(() => {
        getProperties()
            .then((response) => {
                setProperties(response);
            });

    }, [dispatch])

    console.log('properties', properties);

    return (
        <Container className='home'>
                <div className='d-flex title-container'>
                    <div id='home-title'>Projects</div>
                    <Link to='/project' className='link-btn'>+ Add Project</Link>
                </div>
                <Row className='project-tabs' noGutters={true}>
                    <Col xs={8} sm={8} md={6} lg={6} xl={9}>
                        <Row noGutters={true}>
                            <div>
                                <a className='link-btn' href='/'>Active Projects</a>
                            </div>
                            <div id='splitter'>{' | '}</div>
                            <div>
                                <a className='link-btn' href='/'>Closed Projects</a>
                            </div>
                        </Row>
                    </Col>
                    <Col xs={8} sm={8} md={6} lg={6} xl={3}>
                        <Form inline className='search-container'>
                            <FormControl type='text' placeholder='Search' />
                            &nbsp;&nbsp;&nbsp;
                            <Button variant='secondary'>Search</Button>
                        </Form>
                    </Col>
                </Row>

                <Row className='cards' noGutters={true}>
                    {properties?.map((project, index) => (
                        <ProjectCard key={index} project={project} />
                    ))}
                </Row>
        </Container>
    );
}

export default Home;