import React, { useEffect, useState } from 'react';
import { Button, Table, FormControl, Form } from 'react-bootstrap';
import { getUtilities } from '../../actions/utilityActions';
import { useDispatch, useSelector } from 'react-redux';
import './UtilityManagement.scss';

// components 
import AddUtility from '../../components/AddUtility';

const UtilityManagement = () => {
    const dispatch = useDispatch();
    
    const utilities = useSelector(state => state.utility.utilities);

    const [searchTerm, setSearchTerm] = useState('');
    const [showUtilityModal, setShowUtilityModal] = useState(false);
    const [filteredUtilities, setFilteredUtilities] = useState(utilities);

    useEffect(() => {
        dispatch(getUtilities());
    }, [dispatch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const filter = utilities?.filter(utility => 
                utility?.companyName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                utility?.utilityType?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) || 
                utility?.phoneNumber?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                utility?.region?.toLowerCase().includes(searchTerm?.toLowerCase()) || 
                utility?.emailAddress?.toLowerCase().includes(searchTerm?.toLowerCase())
        );

            setFilteredUtilities(filter);
        }, 1000);

        return () => clearTimeout(timer);
    }, [searchTerm, utilities]);


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

                    <div className='d-flex search-bar'> 
                        <Form inline>
                            <FormControl 
                                placeholder='Search Keywords'
                                type='text'
                                onChange={(e) => setSearchTerm(e.target.value)}    
                            />
                        </Form>
                    </div>
                </div>

                <div className='utility-management-table'>
                    <Table hover responsive>
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
                            {filteredUtilities?.map((utility, index) => (
                                <tr key={index}>
                                    <td width='25%'>{utility.companyName}</td>
                                    <td>{utility.utilityType.name}</td>
                                    <td>{utility.phoneNumber}</td>
                                    <td>{utility.emailAddress}</td>
                                    <td>{utility.region}</td>
                                    <td>
                                        <div className='d-flex justify-content-between'>
                                            <i className={`far ${true ? 'fa-heart' : 'fas-heart'}`}></i>
                                            <i className='far fa-pencil-alt'></i>
                                            <i className='far fa-trash-alt'></i>
                                        </div>
                                    </td>
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