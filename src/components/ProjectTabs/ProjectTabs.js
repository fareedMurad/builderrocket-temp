import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import './ProjectTabs.scss';

// components 
import ProjectInformation from '../ProjectInformation';

const ProjectTabs = () => {

    const project = useSelector(state => state.project.project);
    console.log('Project', project);

    return (
        <div className='project-tabs'>
            <Tabs defaultActiveKey='projectInformation' >
                <Tab eventKey='projectInformation' title='Project Information'>
                    <ProjectInformation project={project} />
                </Tab>
                <Tab eventKey='documents' title='Documents'>
                    <div>Hello</div>
                </Tab>
                <Tab eventKey='utilities' title='Utilities'>
                    <div>Hello</div>
                </Tab>
                <Tab eventKey='contractors' title='Contractors'>
                    <div>Hello</div>
                </Tab>
                <Tab eventKey='drawings' title='Drawings'>
                    <div>Hello</div>
                </Tab>
                <Tab eventKey='roomAreaLayout' title='Room/Area Layout'>
                    <div>Hello</div>
                </Tab>
                <Tab eventKey='products' title='Products'>
                    <div>Hello</div>
                </Tab>
            </Tabs>
        </div>
    )
}

export default ProjectTabs;