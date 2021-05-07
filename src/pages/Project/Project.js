import React from 'react';
import { useSelector } from 'react-redux';
import './Project.scss';

// components
import ProjectHeader from '../../components/ProjectHeader';
import ProjectTabs from '../../components/ProjectTabs';

const Project = () => {

    const project = useSelector(state => state.project.project);
    
    console.log('PROJECT', project);

    return (
        <>
            <ProjectHeader />
            <ProjectTabs />
        </> 
    );
}

export default Project;