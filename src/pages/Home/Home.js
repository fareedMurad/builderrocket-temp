import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Form, FormControl } from 'react-bootstrap';
import { getProjects, resetProject } from '../../actions/projectActions.js';
import { getUserProfile } from '../../actions/userActions.js';
import { Link } from 'react-router-dom';
// import { isEmpty } from 'lodash';
import './Home.scss';

// components 
import ProjectCard from '../../components/ProjectCard';
import MarketingBlock from '../../components/MarketingBlock';

const Home = (props) => {
    const { history } = props;

    const dispatch = useDispatch();

    const token = useSelector(state => state.auth.token);
    const projects = useSelector(state => state.project.projects);

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProjects, setFilteredProjects] = useState(projects);
    const [projectsStatus, setProjectsStatus] = useState('Active');

    useEffect(() => {
        if (!token) 
            history.push('/login');
    });
    
    useEffect(() => {
        if (token) {
            dispatch(getProjects());
            dispatch(getUserProfile());
        }

    }, [dispatch, token]);

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

    const filterProjects = () => {
        return filteredProjects.filter(project => projectsStatus === 'Active' 
            ? parseInt(project?.statusID) !== 3 
            : parseInt(project?.statusID) === 3);
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
                            <Button     
                                variant='link' 
                                className={`link-btn ${projectsStatus === 'Active' ? 'active' : 'closed'}`} 
                                onClick={() => setProjectsStatus('Active')}
                            >
                                Active Projects
                            </Button>
                        </div>
                        <div id='splitter'>{' | '}</div>
                        <div>
                            <Button 
                                variant='link' 
                                className={`link-btn ${projectsStatus === 'Closed' ? 'active' : 'closed'}`} 
                                onClick={() => setProjectsStatus('Closed')}
                            >
                                Closed Projects
                            </Button>
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
                        </Form>
                    </div>
                </div>

                <div className='d-flex justify-content-between'>
                    <div className='d-flex flex-wrap cards'>
                        {filterProjects()?.map((project, index) => (
                            <ProjectCard 
                                key={index} 
                                project={project} 
                                history={history} 
                            />
                        ))}
                    </div>
                    
                    <div className='d-flex'>
                        <MarketingBlock />
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default Home;