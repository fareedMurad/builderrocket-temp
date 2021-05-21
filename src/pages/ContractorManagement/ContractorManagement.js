import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Table, Button, Form, FormControl } from 'react-bootstrap';
import { deleteContractor, getContractors } from '../../actions/contractorActions';
import './ContractorManagement.scss';

// components
import AddContractor from '../../components/AddContractor';

const ContractorManagement = () => {
    const dispatch = useDispatch();

    const contractors = useSelector(state => state.contractor.contractors);

    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedContractorID, setSelectedContractorID] = useState();
    const [showContractorModal, setShowContractorModal] = useState(false);
    const [filteredContractors, setFilteredContractors] = useState(contractors);
    
    useEffect(() => {
        dispatch(getContractors());
    }, [dispatch]);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            const filter = contractors?.filter(contractor => 
                contractor?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contractor?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contractor?.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contractor?.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contractor?.uom?.toLowerCase().includes(searchTerm.toLowerCase())
            )

            setFilteredContractors(filter)
        }, 1000);

        return () => clearTimeout(timer);
    }, [searchTerm, contractors]);

    const handleDeleteContractor = () => {
        dispatch(deleteContractor(selectedContractorID))
            .then(() => {
                dispatch(getContractors());
                setShowDeleteModal(false);
            });
    }

    const deleteContractorConfirmation = (contractorID) => {
        setSelectedContractorID(contractorID);

        setShowDeleteModal(true);
    }

    const cancelDeletion = () => {
        setSelectedContractorID();

        setShowDeleteModal(false);
    }

    const deleteContractorModal = () => {
        return (
            <Modal
                show={showDeleteModal}
                onHide={cancelDeletion}
                centered
                size='lg'
            >
                <Modal.Body>
                    <div className='page-title'>Delete Contractor</div>

                    <div className='d-flex justify-content-center'>
                        Are you sure you want to delete this contractor?
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
                            onClick={handleDeleteContractor}
                        >
                            Delete
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }

    return (
        <div className='d-flex contractor-management'>
            <div className='contractor-management-container'>
                <div className='d-flex'>
                    <div className='page-title'>Contractor Management</div>
                    <div className='ml-2 add-btn'>
                        <Button 
                            variant='link' 
                            className='link-btn'
                            onClick={() => setShowContractorModal(true)}    
                        >
                            + Add Contractor
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

                <div className='contractor-management-table'>
                    <Table hover responsive>
                        <thead>
                            <tr>
                                <th>Company Name</th>
                                <th>Contact Name</th>
                                <th>City/State</th>
                                <th>ZIP Code</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Categories</th>
                                <th>UOM/Labor Cost</th>
                                <th>Notes</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredContractors?.map((contractor, index) => (
                                <tr key={index}>
                                    <td width='20%'>{contractor?.companyName}</td>
                                    <td>{contractor?.firstName}</td>
                                    <td>{''}</td>
                                    <td>{''}</td>
                                    <td>{contractor?.phoneNumber}</td>
                                    <td>{contractor?.emailAddress}</td>
                                    <td>{''}</td>
                                    <td>{contractor?.uom}</td>
                                    <td>
                                        <div className='d-flex justify-content-between'>
                                            <i className={`far ${true ? 'fa-heart' : 'fas-heart'}`}></i>
                                            <i className='far fa-pencil-alt'></i>
                                            <i className='far fa-trash-alt' onClick={() => deleteContractorConfirmation(contractor.id)}></i>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>

            </div>

            {showContractorModal && 
                <AddContractor 
                    show={showContractorModal}
                    handleClose={() => setShowContractorModal(false)}
                />
            }
            {deleteContractorModal()}
        </div>
    )

}

export default ContractorManagement;