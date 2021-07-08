import React, { useEffect, useState } from 'react';
import { Button, Table, FormControl, Form, Modal } from 'react-bootstrap';
import { deleteUtility, getUtilities, setSelectedUtility } from '../../actions/utilityActions';
import { useDispatch, useSelector } from 'react-redux';
import './UtilityManagement.scss';

// components 
import AddUtility from '../../components/AddUtility';

const UtilityManagement = () => {
    const dispatch = useDispatch();
    
    const utilities = useSelector(state => state.utility.utilities);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUtilityID, setSelectedUtilityID] = useState();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUtilityModal, setShowUtilityModal] = useState(false);
    const [filteredUtilities, setFilteredUtilities] = useState(utilities);

    useEffect(() => {
        dispatch(getUtilities());
    }, [dispatch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const filter = utilities?.filter(utility => 
                utility?.CompanyName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                utility?.UtilityType?.Name?.toLowerCase().includes(searchTerm?.toLowerCase()) || 
                utility?.PhoneNumber?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                utility?.Region?.toLowerCase().includes(searchTerm?.toLowerCase()) || 
                utility?.EmailAddress?.toLowerCase().includes(searchTerm?.toLowerCase())
        );

            setFilteredUtilities(filter);
        }, 1000);

        return () => clearTimeout(timer);
    }, [searchTerm, utilities]);

    const handleDeleteUtility = () => {
        dispatch(deleteUtility(selectedUtilityID))
            .then(() => {
                dispatch(getUtilities());
                setShowDeleteModal(false);
            });
    }

    const deleteUtilityConfirmation = (utilityID) => {
        setSelectedUtilityID(utilityID);

        setShowDeleteModal(true);
    }

    const cancelDeletion = () => {
        setSelectedUtilityID();

        setShowDeleteModal(false);
    }

    const editUtillity = (utility) => {
        setShowUtilityModal(true);

        dispatch(setSelectedUtility(utility));
    }

    const deleteUtilityModal = () => {
        return (
            <Modal
                show={showDeleteModal}
                onHide={cancelDeletion}
                centered
                size='lg'
            >
                <Modal.Body>
                    <div className='page-title'>Delete Utility</div>

                    <div className='d-flex justify-content-center'>
                        Are you sure you want to delete this utility?
                    </div>

                    <div className='d-flex justify-content-center pt-5'>
                        <Button 
                            onClick={cancelDeletion} 
                            variant='link' 
                            className='cancel'
                        >
                            Cancel
                        </Button>
                        <button 
                            className='primary-gray-btn next-btn ml-3'
                            onClick={handleDeleteUtility}
                        >
                            Delete
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }

    return (
        <div className='d-flex utility-management'>
            <div className='utility-management-container'>
                <div className='d-flex'>
                    <div className='page-title'>Utility Management</div>
                    <div className='ml-2'>
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
                                    <td width='25%'>{utility?.CompanyName}</td>
                                    <td>{utility?.UtilityType?.Name}</td>
                                    <td>{utility?.PhoneNumber}</td>
                                    <td>{utility?.EmailAddress}</td>
                                    <td>{utility?.Region}</td>
                                    <td>
                                        <div className='d-flex justify-content-between'>
                                            <i className={`far ${true ? 'fa-heart' : 'fas-heart'}`}></i>
                                            <i 
                                                className='far fa-pencil-alt'
                                                onClick={() => editUtillity(utility)}
                                            ></i>
                                            <i 
                                                className='far fa-trash-alt' 
                                                onClick={() => deleteUtilityConfirmation(utility.ID)}
                                            ></i>
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
            {deleteUtilityModal()}
        </div>
    );
}

export default UtilityManagement;