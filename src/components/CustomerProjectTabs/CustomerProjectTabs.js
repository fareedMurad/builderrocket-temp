import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedProjectTab } from '../../actions/projectActions';
import './CustomerProjectTabs.scss';

// components 
import CustomerProducts from '../CustomerProducts';
import AddProduct from '../AddProduct';
import ProductDetail from '../ProductDetail';
import CustomerProjectInformation from '../CustomerProjectInformation';

const CustomerProjectTabs = (props) => {
    const dispatch = useDispatch();

    const selectedProjectTab = useSelector(state => state.project.selectedProjectTab);
    const selectedProductTab = useSelector(state => state.product.selectedProductTab);

    const handleSelectedTab = (tab) => {
        dispatch(setSelectedProjectTab(tab));
    }

    const handleProductsTabs = () => {
        switch(selectedProductTab) {
            case 'products': 
                return <CustomerProducts />;
            case 'productDetail':
                return <ProductDetail />;
            default:
                return <CustomerProducts />;
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
                        <CustomerProjectInformation />
                    )}
                </Tab>
                <Tab eventKey='products' title='Products'>
                    {selectedProjectTab === 'products' && (
                        handleProductsTabs()
                    )}
                </Tab>
                
            </Tabs>
        </div>
    )
}

export default CustomerProjectTabs;
