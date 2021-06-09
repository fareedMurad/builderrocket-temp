import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedProjectTab } from '../../actions/projectActions';
import './ProjectTabs.scss';

// components 
import Drawings from '../Drawings';
import Products from '../Products';
import Documents from '../Documents';
import Utilities from '../Utilities';
import Contractors from '../Contractors';
import RoomAreaLayout from '../RoomAreaLayout';
import ProjectInformation from '../ProjectInformation';


const ProjectTabs = (props) => {
    const dispatch = useDispatch();

    const selectedProjectTab = useSelector(state => state.project.selectedProjectTab);

    const handleSelectedTab = (tab) => {
        dispatch(setSelectedProjectTab(tab));
    }

    return (
        <div className='project-tabs'>
            <Tabs
                activeKey={selectedProjectTab}
                onSelect={(tab) => handleSelectedTab(tab)}
                transition={false}
            >
                <Tab eventKey='projectInformation' title='Project Information'>
                    {selectedProjectTab === 'projectInformation' &&
                        <ProjectInformation />
                    }
                </Tab>
                <Tab eventKey='documents' title='Documents'>
                    {selectedProjectTab === 'documents' &&
                        <Documents />
                    }
                </Tab>
                <Tab eventKey='utilities' title='Utilities'>
                    {selectedProjectTab === 'utilities' &&
                        <Utilities />
                    }
                </Tab>
                <Tab eventKey='contractors' title='Contractors'>
                    {selectedProjectTab === 'contractors' &&
                        <Contractors />
                    }
                </Tab>
                <Tab eventKey='drawings' title='Drawings'>
                    {selectedProjectTab === 'drawings' &&
                        <Drawings />
                    }
                </Tab>
                <Tab eventKey='roomAreaLayout' title='Room/Area Layout'>
                    {selectedProjectTab === 'roomAreaLayout' &&
                        <RoomAreaLayout />
                    }
                </Tab>
                <Tab eventKey='products' title='Products'>
                    {selectedProjectTab === 'products' &&
                        <Products />
                    }
                </Tab>
            </Tabs>
        </div>
    )
}

export default ProjectTabs;