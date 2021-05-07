import React, { useEffect, useState } from 'react';
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

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProjects, setFilteredProjects] = useState(projects);

    useEffect(() => {
        if (!token) 
            history.push('/login');
    

        if (token && isEmpty(projects)) {
            dispatch(getProjects(token));
        }
    }, [dispatch, token, history, projects]);

    useEffect(() => {
        /* Filter projects on project name, project #, lot #, street address, or customer first name.
        Filter delayed by 1 second */
        const timer = setTimeout(() => {
            const filter = projects?.filter(project => 
                project?.projectName?.toLowerCase().includes(searchTerm?.toLowerCase()) || 
                project?.projectNumber?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                project?.lotNumber?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                project?.streetAddress1?.toLowerCase().includes(searchTerm?.toLowerCase()) || 
                project?.customers?.find(customer => customer?.firstName?.toLowerCase().includes(searchTerm?.toLowerCase()))
        );

            setFilteredProjects(filter);
        }, 1000);

        return () => clearTimeout(timer);
    }, [searchTerm, projects]);

    const goToAddProject = () => {
        dispatch(resetProject());
    }

    return (
        <div className='home'>
            <Container>
                <div className='d-flex title-container'>
                    <div id='home-title'>Projects</div>
                    <Link 
                        onClick={goToAddProject} 
                        to='/project' 
                        className='link-btn'
                    >
                        + Add Project
                    </Link>
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
                            <FormControl 
                                className='search-container' 
                                placeholder='Search'
                                type='text'
                                onChange={(e) => setSearchTerm(e.target.value)}    
                            />
                            {/* &nbsp;&nbsp;&nbsp; */}
                            {/* <button className='primary-gray-btn'>Search</button> */}
                        </Form>
                    </div>
                </div>

                <Row className='cards' noGutters>
                    <Col md={8} xl={9}>
                        <div className='d-flex flex-wrap'>
                            {filteredProjects?.map((project, index) => (
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