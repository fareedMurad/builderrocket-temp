import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Form, Col, Button } from 'react-bootstrap';
import { createContractor, getContractors, getContractorTypes, setSelectedContractor } from '../../actions/contractorActions';
import { isEmpty } from 'lodash';
import './AddContractor.scss';


const AddContractor = (props) => {
    const { show, handleClose } = props;

    const dispatch = useDispatch();

    const selectedContractor = useSelector(state => state.contractor.contractor);
    const contractorTypes = useSelector(state => state.contractor.contractorTypes);

    const [contractor, setContractor] = useState({});

    useEffect(() => {
        setContractor(selectedContractor);

        return () => {
            dispatch(setSelectedContractor({}));
        }
    }, [dispatch, selectedContractor]);

    useEffect(() => {
        dispatch(getContractorTypes());
    }, [dispatch]);

    const setContractorTypes = (id) => {
        const selectedContractorType = contractorTypes?.find((contractorType) => contractorType.ID === id);

        setContractor({ ...contractor, ContractorTypes: [selectedContractorType] });
    }

    const handleCreateContractor = () => {
        dispatch(createContractor(contractor))
            .then(() => {
                dispatch(getContractors());
                handleClose();
            })
    }
    console.log('Add Contractor', contractor);

    return (
        <Modal 
            show={show} 
            onHide={handleClose}
            centered
            className='add-contractor'
            size='xl'
        >
            <Modal.Body>
                <div className='page-title ml-2'>Add Contractor</div>
                
                <div className='d-flex flex-wrap add-contractor-form'>
                    <Col md={6}>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Company Name*</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                onChange={(e) => setContractor({ ...contractor, CompanyName: e.target.value })}
                                defaultValue={contractor?.CompanyName}
                            />
                        </div>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>City/State</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                // onChange={(e) => setContractor({ ...contractor, cityState: e.target.value })}
                            />
                        </div>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Phone</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                onChange={(e) => setContractor({ ...contractor, PhoneNumber: e.target.value })}
                                defaultValue={contractor?.PhoneNumber}
                            />
                        </div>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Categories</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                // onChange={(e) => setContractor({ ...contractor, Region: e.target.value })}
                            />
                        </div>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>UOM</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                onChange={(e) => setContractor({ ...contractor, UOM: e.target.value })}
                                defaultValue={contractor?.UOM}
                            />
                        </div>
                    </Col>

                    <Col md={6}> 
                        <div className='pb-4 select'>
                            <Form.Label className='input-label'>Contractor Type*</Form.Label>
                            <Form.Control 
                                as='select'
                                multiple
                                onChange={(e) => setContractorTypes(e.target.value)}
                                value={contractor?.ContractorTypes?.[0]?.ID}
                            >
                                <option>SELECT</option>
                                {contractorTypes?.map((contractorType, index) => (
                                    <option 
                                        key={index} 
                                        value={contractorType?.ID}
                                    >
                                        {contractorType.Name}
                                    </option>
                                ))}
                            </Form.Control>
                        </div>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Contact Name</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                onChange={(e) => setContractor({ ...contractor, FirstName: e.target.value })}
                                defaultValue={contractor?.FirstName}
                            />
                        </div>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>ZIP Code</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                onChange={(e) => setContractor({ ...contractor, Zip: e.target.value })}
                                defaultValue={contractor?.Zip}
                            />
                        </div>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Email</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                onChange={(e) => setContractor({ ...contractor, EmailAddress: e.target.value })}
                                defaultValue={contractor?.EmailAddress}
                            />
                        </div>
                    </Col>
                </div>
                
                <div className='d-flex justify-content-center pt-5'>
                    <Button 
                        onClick={handleClose} 
                        variant='link' 
                        className='cancel'
                    >
                        Cancel
                    </Button>
                    <button 
                        className='primary-gray-btn next-btn ml-3'
                        disabled={!contractor.CompanyName || isEmpty(contractor?.ContractorTypes)}
                        onClick={handleCreateContractor}
                    >
                        Save
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default AddContractor;