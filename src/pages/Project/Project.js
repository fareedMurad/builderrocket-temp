import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedProjectTab } from '../../actions/projectActions';
import './Project.scss';

// components
import ProjectHeader from '../../components/ProjectHeader';
import ProjectTabs from '../../components/ProjectTabs';

const Project = () => { 
    const dispatch = useDispatch();

    useEffect(() => {
        // reset selected tab when leaving page
        return () => {
            dispatch(setSelectedProjectTab('projectInformation'));
        }
    });

    return (
        <>
            <ProjectHeader />
            <ProjectTabs />
        </> 
    );
}

export default Project;