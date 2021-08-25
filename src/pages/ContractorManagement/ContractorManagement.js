import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Form, 
    Modal, 
    Table, 
    Button, 
    Spinner,
    Tooltip,    
    FormControl,
    OverlayTrigger, 
} from 'react-bootstrap';
import { 
    getContractors, 
    deleteContractor, 
    setSelectedContractor 
} from '../../actions/contractorActions';
import './ContractorManagement.scss';

// components
import AddContractor from '../../components/AddContractor';

const ContractorManagement = () => {
    const dispatch = useDispatch();

    const contractors = useSelector(state => state.contractor.contractors);

    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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
                contractor?.CompanyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contractor?.FirstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contractor?.PhoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contractor?.EmailAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contractor?.UOM?.toLowerCase().includes(searchTerm.toLowerCase())
            )

            setFilteredContractors(filter)
        }, 1000);

        return () => clearTimeout(timer);
    }, [searchTerm, contractors]);

    const handleDeleteContractor = () => {
        setIsLoading(true);

        dispatch(deleteContractor(selectedContractorID))
            .then(() => {
                dispatch(getContractors());
        
            })
            .then(() => {
                setIsLoading(false);
                setShowDeleteModal(false);
            })
    }

    const deleteContractorConfirmation = (contractorID) => {
        setSelectedContractorID(contractorID);

        setShowDeleteModal(true);
    }

    const cancelDeletion = () => {
        setSelectedContractorID();

        setShowDeleteModal(false);
    }

    const editContractor = (contractor) => {
        setShowContractorModal(true);

        dispatch(setSelectedContractor(contractor));
    }

    const deleteContractorModal = () => {
        return (
            <Modal
                size='lg'
                centered
                show={showDeleteModal}
                onHide={cancelDeletion}
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

    const handleCloseContractorModal = () => {
        dispatch(setSelectedContractor({}));
        setShowContractorModal(false);
    }

    const renderTooltip = (props) => (
        <Tooltip id='button-tooltip' {...props}>
            Tooltip
        </Tooltip>
      );

    return (
        <div className='d-flex contractor-management'>
            <div className='contractor-management-container'>
                <div className='d-flex'>
                    <div className='page-title'>Contractor Management</div>
                    <div className='ml-2'>
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
                                    <td width='20%'>{contractor?.CompanyName}</td>
                                    <td>{contractor?.FirstName}</td>
                                    <td>{''}</td>
                                    <td>{''}</td>
                                    <td>{contractor?.PhoneNumber}</td>
                                    <td>{contractor?.EmailAddress}</td>
                                    <td>{''}</td>
                                    <td>{contractor?.UOM}</td>
                                    <td>
                                        <OverlayTrigger
                                            placement='top'
                                            overlay={renderTooltip}
                                            delay={{ show: 250, hide: 400 }}
                                        >
                                            <i className='far fa-sticky-note d-flex justify-content-center'></i>
                                        </OverlayTrigger>
                                    </td>
                                    <td>
                                        {(isLoading && selectedContractorID === contractor.ID) ? (
                                            <Spinner 
                                                size='sm'
                                                className='justify-content-center d-flex'
                                                animation='border'
                                                variant='primary' 
                                            />
                                        ) : (
                                            <div className='d-flex justify-content-between'>
                                                <i className={`far ${true ? 'fa-heart' : 'fas-heart'}`}></i>
                                                <i 
                                                    className='far fa-pencil-alt'
                                                    onClick={() => editContractor(contractor)}
                                                ></i>
                                                <i 
                                                    className='far fa-trash-alt' 
                                                    onClick={() => deleteContractorConfirmation(contractor.ID)}
                                                ></i>
                                            </div>
                                        )}
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
                    handleClose={handleCloseContractorModal}
                />
            }
            {deleteContractorModal()}
        </div>
    )

}

export default ContractorManagement;