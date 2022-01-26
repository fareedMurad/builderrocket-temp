import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedProjectTab } from '../../actions/projectActions';
import { setSelectedProductTab } from '../../actions/productActions';
import './ProjectTabs.scss';

// components 
import Drawings from '../Drawings';
import Products from '../Products';
import Documents from '../Documents';
import Utilities from '../Utilities';
import AddProduct from '../AddProduct';
import ReplaceProduct from '../ReplaceProduct'
import Contractors from '../Contractors';
import ProductDetail from '../ProductDetail';
import RoomAreaLayout from '../RoomAreaLayout';
import ProjectInformation from '../ProjectInformation';
import Reports from '../Reports';

const ProjectTabs = (props) => {
    const dispatch = useDispatch();

    const selectedProjectTab = useSelector(state => state.project.selectedProjectTab);
    const selectedProductTab = useSelector(state => state.product.selectedProductTab);
    const project = useSelector(state => state.project.project);

    const handleSelectedTab = (tab) => {
        dispatch(setSelectedProjectTab(tab));
        if(tab === 'products') {
            dispatch(setSelectedProductTab(tab))
        }
    }

    const handleProductsTabs = () => {
        switch (selectedProductTab) {
            case 'products':
                return <Products />;
            case 'addProduct':
                return <AddProduct />;
            case 'replaceProduct':
                return <ReplaceProduct />;
            case 'productDetail':
                return <ProductDetail />;
            default:
                return <Products />;
        }
    }

    return (
        <div className='project-tabs'>
            <Tabs
                activeKey={selectedProjectTab}
                onSelect={(tab) => handleSelectedTab(tab)}
                transition={false}
            >
                <Tab eventKey='projectInformation' title='Project Information'>
                    {selectedProjectTab === 'projectInformation' && (
                        <ProjectInformation />
                    )}
                </Tab>
                <Tab eventKey='documents' title='Documents' disabled={!project?.ID}>
                    {selectedProjectTab === 'documents' && (
                        <Documents />
                    )}
                </Tab>
                <Tab eventKey='utilities' title='Utilities' disabled={!project?.ID}>
                    {selectedProjectTab === 'utilities' && (
                        <Utilities />
                    )}
                </Tab>
                <Tab eventKey='contractors' title='Contractors' disabled={!project?.ID}>
                    {selectedProjectTab === 'contractors' && (
                        <Contractors />
                    )}
                </Tab>
                <Tab eventKey='drawings' title='Drawings' disabled={!project?.ID}>
                    {selectedProjectTab === 'drawings' && (
                        <Drawings />
                    )}
                </Tab>
                <Tab eventKey='roomAreaLayout' title='Room/Area Layout' disabled={!project?.ID}>
                    {selectedProjectTab === 'roomAreaLayout' && (
                        <RoomAreaLayout />
                    )}
                </Tab>
                <Tab eventKey='products' title='Products' disabled={!project?.ID}>
                    {selectedProjectTab === 'products' && (
                        handleProductsTabs()
                    )}
                </Tab>
                <Tab eventKey='reports' title='Reports'>
                    {selectedProjectTab === 'reports' && (
                        <Reports />
                    )}
                </Tab>
            </Tabs>
        </div>
    )
}

export default ProjectTabs;
