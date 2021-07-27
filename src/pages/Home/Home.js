import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Form, FormControl, Spinner } from 'react-bootstrap';
import { getProjects, resetProject } from '../../actions/projectActions.js';
import { getUserProfile } from '../../actions/userActions.js';
import { Link } from 'react-router-dom';
import './Home.scss';

// components 
import ProjectCard from '../../components/ProjectCard';
import MarketingBlock from '../../components/MarketingBlock';

const Home = (props) => {
    const { history } = props;

    const dispatch = useDispatch();

    const isSignedIn = useSelector(state => state.auth.isSignedIn);
    const projects = useSelector(state => state.project.projects);

    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [filteredProjects, setFilteredProjects] = useState(projects);
    const [projectsStatus, setProjectsStatus] = useState('Active');
    
    useEffect(() => {
        if (isSignedIn) {
            setIsLoading(true);
            
            dispatch(getProjects())
                .then(() => {
                    setIsLoading(false);
                })
                .catch(() => setIsLoading(false));

            dispatch(getUserProfile());
        }

    }, [dispatch, isSignedIn]);

    useEffect(() => {
        /* Filter projects on project name, project #, lot #, street address, or customer first name.
        Filter delayed by 1 second */
        const timer = setTimeout(() => {
            const filter = projects?.filter(project => 
                project?.ProjectName?.toLowerCase().includes(searchTerm?.toLowerCase()) || 
                project?.ProjectNumber?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                project?.LotNumber?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                project?.StreetAddress1?.toLowerCase().includes(searchTerm?.toLowerCase()) || 
                project?.Customers?.find(customer => customer?.FirstName?.toLowerCase().includes(searchTerm?.toLowerCase()))
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
            ? parseInt(project?.StatusID) !== 3 
            : parseInt(project?.StatusID) === 3);
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

                {!isLoading && (
                    <div className='d-flex justify-content-between cards-container'>
                            <div className='d-flex flex-wrap cards'>
                                {filterProjects()?.map((project, index) => (
                                    <ProjectCard 
                                        key={index} 
                                        project={project} 
                                        history={history} 
                                    />
                                ))}
                            </div>
                            <MarketingBlock />
                    </div>
                )}
            </Container>
            
            {isLoading && (
                <div className='spinner d-flex justify-content-center'>
                    <Spinner 
                        animation='border'
                        variant='primary' 
                    />
                </div>
            )}
        </div>
    );
}

export default Home;