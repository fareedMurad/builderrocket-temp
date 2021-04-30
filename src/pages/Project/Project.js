import React from 'react';
import { Col } from 'react-bootstrap';
// import { useSelector } from 'react-redux';
import './Project.scss';

// components
import ProjectHeader from '../../components/ProjectHeader';
import ProjectSubheader from '../../components/ProjectSubheader';
import ProjectInformation from '../../components/ProjectInformation';

const Project = () => {

    // const project = useSelector(state => state.project.project);
    
    return (
        <>
            <ProjectHeader />
            <ProjectSubheader />

            <div className='project'>

                <Col md={8}>
                    <div className='tab-container'>
                        <ProjectInformation />
                    </div>
                </Col>

                <Col></Col>
            </div>   
        </> 
    );
}

export default Project;