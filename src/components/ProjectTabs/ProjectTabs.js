import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import './ProjectTabs.scss';

// components 
import ProjectInformation from '../ProjectInformation';
import Documents from '../Documents';
import Utilities from '../Utilities';
import Contractors from '../Contractors';
import Drawings from '../Drawings';
import RoomAreaLayout from '../RoomAreaLayout';
import Products from '../Products';


const ProjectTabs = () => {
    const project = useSelector(state => state.project.project);

    const [selectedTab, setSelectedTab] = useState('projectInformation');
    // console.log('Project', project);

    return (
        <div className='project-tabs'>
            <Tabs
                activeKey={selectedTab}
                onSelect={(tab) => setSelectedTab(tab)}
            >
                <Tab eventKey='projectInformation' title='Project Information'>
                    <ProjectInformation project={project} />
                </Tab>
                <Tab eventKey='documents' title='Documents'>
                    <Documents />
                </Tab>
                <Tab eventKey='utilities' title='Utilities'>
                    <Utilities project={project} />
                </Tab>
                <Tab eventKey='contractors' title='Contractors'>
                    <Contractors />
                </Tab>
                <Tab eventKey='drawings' title='Drawings'>
                    <Drawings />
                </Tab>
                <Tab eventKey='roomAreaLayout' title='Room/Area Layout'>
                    <RoomAreaLayout />
                </Tab>
                <Tab eventKey='products' title='Products'>
                    <Products />
                </Tab>
            </Tabs>
        </div>
    )
}

export default ProjectTabs;