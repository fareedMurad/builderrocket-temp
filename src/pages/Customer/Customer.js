import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty} from 'lodash';
import {getCustomerProjectByProjectID, setSelectedProjectTab } from '../../actions/projectActions';
import './Customer.scss';
import CustomerProjectHeader from '../../components/CustomerProjectHeader';
import CustomerProjectTabs from '../../components/CustomerProjectTabs';

// components


const Customer= () => {
    const dispatch = useDispatch();
    const customerproject = useSelector(state => state.auth.customerproject);
    console.warn(customerproject)
    
    let test = "";
    if(test===""){
        dispatch(getCustomerProjectByProjectID(customerproject))
        //test = useSelector(state => state?.project?.project?.ProjectNumber);
    }
    useEffect(() => {
        if(isEmpty(customerproject)){
            dispatch(setSelectedProjectTab('projectInformation'));
        }
    },[customerproject]);
    return (
        <>
            <CustomerProjectHeader />
            <CustomerProjectTabs/>
        </> 
    );
}

export default Customer;