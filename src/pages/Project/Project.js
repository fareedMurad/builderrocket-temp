import React, { } from 'react';
import { useSelector } from 'react-redux';
import './Project.scss';

// components
import ProjectHeader from '../../components/ProjectHeader';
import MarketingBlock from '../../components/MarketingBlock';
import ProjectSubheader from '../../components/ProjectSubheader';
import ProjectInformation from '../../components/ProjectInformation';

const Project = () => {

    const project = useSelector(state => state.project.project);
    
    console.log('PROJECT', project);

    return (
        <>
            <ProjectHeader />
            <ProjectSubheader />

            <div className='d-flex justify-content-center project'>
                <div className='tab-container'>
                    <ProjectInformation project={project} />
                </div>

                <div>
                    <MarketingBlock />
                </div>
            </div>   
        </> 
    );
}

export default Project;