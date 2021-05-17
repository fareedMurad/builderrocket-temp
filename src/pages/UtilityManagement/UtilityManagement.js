import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getUtilities } from '../../actions/utilityActions';
import './UtilityManagement.scss';

// components 
import AddUtility from '../../components/AddUtility';

const UtilityManagement = () => {
    const dispatch = useDispatch();
    
    const utilities = useSelector(state => state.utility.utilities);
    // console.log('utilities', utilities);
    const [showUtilityModal, setShowUtilityModal] = useState(false);

    useEffect(() => {
        dispatch(getUtilities());
    }, [dispatch]);


    return (
        <div className='d-flex utility-management'>
            <div className='utility-management-container'>
                <div className='d-flex'>
                    <div className='page-title'>Utility Management</div>
                    <div className='ml-2 add-btn'>
                        <Button 
                            variant='link' 
                            className='link-btn'
                            onClick={() => setShowUtilityModal(true)}    
                        >
                            + Add Utility
                        </Button>
                    </div>    
                </div>

                <div className='utility-management-table'>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Utility Name</th>
                                <th>Type</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Region</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {utilities?.map((utility, index) => (
                                <tr key={index}>
                                    <td>{utility.companyName}</td>
                                    <td>{utility.utilityType.name}</td>
                                    <td>{utility.phoneNumber}</td>
                                    <td>{utility.emailAddress}</td>
                                    <td>{utility.region}</td>
                                    <td>ICONS</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>



            {showUtilityModal && 
                <AddUtility 
                    show={showUtilityModal} 
                    handleClose={() => setShowUtilityModal(false)} 
                />
            }
        </div>
    );
}

export default UtilityManagement;