import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Form, Col, Button, Row, Spinner } from 'react-bootstrap';
import { 
    createContractor, 
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

    const handleSelectedContractor = useCallback(() => {
        // Set selected contractor to component state to edit 
        if (!isEmpty(selectedContractor)) {
            const tempContractor = {
                ...selectedContractor, 
                ContractorTypes: selectedContractor.ContractorTypes.map((contractorType) => {
                    return {
                        value: contractorType.ID, 
                        label: contractorType.Name 
                    }
                })
            }
    
            setContractor(tempContractor);
        }
    }, [selectedContractor]);

    useEffect(() => {
        handleSelectedContractor();

    }, [handleSelectedContractor]);

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

        // remap contractor types to save properly
        const contractorFinal = {
            ...contractor, 
            ContractorTypes: contractor.ContractorTypes?.map(type => {
                return { 
                    ID: type.value
                }
            })
        }

        dispatch(createContractor(contractorFinal))
            .then(() => {
                dispatch(setSelectedContractor({}));
                setIsLoading(false);
                handleClose();
            })
            .catch(() => {
                setIsLoading(false); 
                alert('Something went wrong creating contractor');
            })
    }

    const title = isEmpty(contractor) ? 'Add Contractor' : 'Edit Contractor';
    
    return (
        <Modal 
            size='lg'
            centered
            show={show} 
            onHide={handleClose}
            className='add-contractor-modal'
        >
            <Modal.Body>
                <div className='page-title'>{title}</div>
                <Row>
                    <Col md={12} lg={6}>
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
                    <Col md={12} lg={6}>
                        <Form.Group>
                            <Form.Label className='input-label'>Contractor Type*</Form.Label>
                            <Select 
                                isMulti 
                                options={
                                    contractorTypes?.map((contractor, index) => { 
                                        return { value: contractor.ID, label: contractor.Name }
                                    })
                                }
                                value={contractor.ContractorTypes}
                                onChange={(options) => setContractor({ ...contractor, ContractorTypes: options })}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={12} lg={6}>
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
                    <Col md={12} lg={6}>
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
                    <Col md={12} lg={6}>
                        <Form.Group>
                            <Form.Label className='input-label'>Address 1</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                onChange={(e) => setContractor({ ...contractor, Address1: e.target.value })}
                                defaultValue={contractor?.Address1}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={12} lg={6}>
                        <Form.Group>
                            <Form.Label className='input-label'>Address 2</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                onChange={(e) => setContractor({ ...contractor, Address2: e.target.value })}
                                defaultValue={contractor?.Address2}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={12} lg={6}>
                        <Form.Group>
                            <Form.Label className='input-label'>City</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                onChange={(e) => setContractor({ ...contractor, City: e.target.value })}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={12} lg={6}>
                        <Form.Group>
                            <Form.Label className='input-label'>State</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                onChange={(e) => setContractor({ ...contractor, State: e.target.value })}
                            />
                        </Form.Group>
                    </Col>   
                    <Col md={12} lg={6}>
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
                    <Col md={12} lg={6}>
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
                    <Col md={12} lg={6}>
                        <Form.Group>
                            <Form.Label className='input-label'>Categories</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                // onChange={(e) => setContractor({ ...contractor, Region: e.target.value })}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={12} lg={6}>
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
                    <Col md={12}>
                        <Form.Group>
                        <Form.Label className='input-label'>Notes</Form.Label>
                        <Form.Control
                            rows={4}
                            type='text'
                            as='textarea'
                            className='input-gray'
                            onChange={(e) => setContractor({ ...contractor, Notes: e.target.value })}
                            defaultValue={contractor?.Notes}
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