import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Form, Col, Button, Row, Spinner } from 'react-bootstrap';
import { 
    createContractor, 
    getContractors, 
    getContractorTypes, 
    setSelectedContractor 
} from '../../actions/contractorActions';
import Select from 'react-select';
import { isEmpty } from 'lodash';
import './AddContractor.scss';

const AddContractor = ({ show, handleClose }) => {
    const dispatch = useDispatch();

    const selectedContractor = useSelector(state => state.contractor.contractor);
    const contractorTypes = useSelector(state => state.contractor.contractorTypes);

    const [contractor, setContractor] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isEmpty(selectedContractor)) {
            // const contractorTypes = selectedContractor.ContractorTypes.m


            setContractor(selectedContractor);
        }
    }, [dispatch, selectedContractor]);
    
    // console.log('selected', selectedContractor, contractorTypes);
    // console.log('Contractor Types', contractor);

    useEffect(() => {
        if (isEmpty(contractorTypes))
            dispatch(getContractorTypes());
    }, [dispatch, contractorTypes]);

    const handleSaveContractor = () => {
        if (!contractor.CompanyName) {
            return alert('Company Name is Required');
        } else if (isEmpty(contractor?.ContractorTypes)) {
            return alert('Contractor Types are Required');
        }

        setIsLoading(true);

        const contractorFinal = {
            ...contractor, 
            ContractorTypes: contractor.ContractorTypes?.map(type => {
                return { 
                    ID: type.value,
                    Name: type.label
                }
            })
        }
        console.log('FINAL', contractorFinal);
        dispatch(createContractor(contractor))
            .then(() => {
                dispatch(getContractors());
                dispatch(setSelectedContractor({}));
                setIsLoading(false);
                handleClose();
            });
    }

    const title = isEmpty(contractor) ? 'Add Contractor' : 'Edit Contractor';
    
    return (
        <Modal 
            size='xl'
            centered
            show={show} 
            onHide={handleClose}
            className='add-contractor-modal'
        >
            <Modal.Body>
                <div className='page-title'>{title}</div>

                <Row>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className='input-label'>Company Name*</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                onChange={(e) => setContractor({ ...contractor, CompanyName: e.target.value })}
                                defaultValue={contractor?.CompanyName}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className='input-label'>Contractor Type*</Form.Label>
                            <Select 
                                isMulti 
                                options={
                                    contractorTypes?.map((contractor, index) => { 
                                        return { value: contractor.ID, label: contractor.Name }
                                    })
                                }
                                onChange={(options) => setContractor({ ...contractor, ContractorTypes: options })}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className='input-label'>Contact Name</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                onChange={(e) => setContractor({ ...contractor, FirstName: e.target.value })}
                                defaultValue={contractor?.FirstName}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className='input-label'>Phone</Form.Label>
                            <Form.Control
                                type='text'
                                inputMode='tel'
                                className='input-gray'
                                onChange={(e) => setContractor({ ...contractor, PhoneNumber: e.target.value })}
                                defaultValue={contractor?.PhoneNumber}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className='input-label'>City</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                // onChange={(e) => setContractor({ ...contractor, City: e.target.value })}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className='input-label'>State</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                // onChange={(e) => setContractor({ ...contractor, State: e.target.value })}
                            />
                        </Form.Group>
                    </Col>   
                    <Col md={6}>
                        <Form.Group>
                        <Form.Label className='input-label'>ZIP Code</Form.Label>
                        <Form.Control
                            type='text'
                            className='input-gray'
                            onChange={(e) => setContractor({ ...contractor, Zip: e.target.value })}
                            defaultValue={contractor?.Zip}
                        />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className='input-label'>Email</Form.Label>
                            <Form.Control
                                type='email'
                                inputMode='email'
                                className='input-gray'
                                onChange={(e) => setContractor({ ...contractor, EmailAddress: e.target.value })}
                                defaultValue={contractor?.EmailAddress}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className='input-label'>Categories</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                // onChange={(e) => setContractor({ ...contractor, Region: e.target.value })}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                        <Form.Label className='input-label'>UOM</Form.Label>
                        <Form.Control
                            type='text'
                            className='input-gray'
                            onChange={(e) => setContractor({ ...contractor, UOM: e.target.value })}
                            defaultValue={contractor?.UOM}
                        />
                        </Form.Group>
                    </Col>
                </Row>
                
                <div className='d-flex justify-content-center pt-5'>
                {isLoading ? (
                        <Spinner 
                           animation='border'
                           variant='primary' 
                       />
                    ) : (
                        <>
                            <Button 
                                variant='link' 
                                className='cancel'
                                onClick={handleClose} 
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSaveContractor}
                                className='primary-gray-btn next-btn ml-3'
                            >
                                Save
                            </Button>
                        </>
                    )}
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default AddContractor;