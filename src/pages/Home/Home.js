import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Form, FormControl } from 'react-bootstrap';
import { getProjects, resetProject } from '../../actions/projectActions.js';
import { Link } from 'react-router-dom';
import { isEmpty } from 'lodash';
import './Home.scss';

// components 
import ProjectCard from '../../components/ProjectCard';
import MarketingBlock from '../../components/MarketingBlock';

const Home = (props) => {
    const { history } = props;
    const dispatch = useDispatch();

    const projects = useSelector(state => state.project.projects);
    const token = useSelector(state => state.auth.token);

    useEffect(() => {
        if (!token) 
            history.push('/login');
    

        if (token && isEmpty(projects)) {
            dispatch(getProjects(token))
                .then((data) => {
                    console.log('DATA', data);
                });
        }
    }, [dispatch, token, history, projects]);

    const goToAddProject = () => {
        dispatch(resetProject());
    }

    return (
        <div className='home'>
            <Container>
                <div className='d-flex title-container'>
                    <div id='home-title'>Projects</div>
                    <Link onClick={goToAddProject} to='/project' className='link-btn'>+ Add Project</Link>
                </div>
                <div className='d-flex project-tabs'>
                    <div className='d-flex'> 
                        <div>
                            <a className='link-btn' href='/'>Active Projects</a>
                        </div>
                        <div id='splitter'>{' | '}</div>
                        <div>
                            <a className='link-btn' href='/'>Closed Projects</a>
                        </div>
                    </div>
                    <div className='d-flex search-bar'> 
                        <Form inline>
                            <FormControl className='search-container' type='text' />
                            &nbsp;&nbsp;&nbsp;
                            <button className='primary-gray-btn'>Search</button>
                        </Form>
                    </div>
                </div>

                <Row className='cards' noGutters>
                    <Col md={8} xl={9}>
                        <div className='d-flex flex-wrap'>
                            {projects?.map((project, index) => (
                                <ProjectCard key={index} project={project} history={history} />
                            ))}
                        </div>
                    </Col>
                    
                    <Col md={2} xl={3}>
                        <MarketingBlock />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Home;