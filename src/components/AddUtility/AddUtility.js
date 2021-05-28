import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Form, Col, Button } from 'react-bootstrap';
import { getUtilityTypes, createUtility, getUtilities, setSelectedUtility } from '../../actions/utilityActions';
import './AddUtility.scss';

const AddUtility = (props) => {
    const { show, handleClose } = props;

    const dispatch = useDispatch();

    const selectedUtility = useSelector(state => state.utility.utility);
    const utilityTypes = useSelector(state => state.utility.utilityTypes);

    const [utility, setUtility] = useState({});

    useEffect(() => {
        setUtility(selectedUtility);

        return () => {
            dispatch(setSelectedUtility({}));
        }
    }, [dispatch, selectedUtility]);

    useEffect(() => {
        dispatch(getUtilityTypes());
    }, [dispatch]);

    const handleCreateUtility = () => {
        dispatch(createUtility(utility))
            .then(() => {
                dispatch(getUtilities());
                handleClose();
            });
    }

    return (
        <Modal 
            show={show} 
            onHide={handleClose}
            centered
            className='add-utility'
            size='xl'
        >
            <Modal.Body>
                <div className='page-title'>Add Utility</div>
                
                <div className='d-flex flex-wrap add-utility-form'>
                    <Col md={6}>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Utility Name*</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                onChange={(e) => setUtility({ ...utility, CompanyName: e.target.value })}
                                defaultValue={utility?.CompanyName}
                            />
                        </div>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Phone</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                onChange={(e) => setUtility({ ...utility, PhoneNumber: e.target.value })}
                                defaultValue={utility?.PhoneNumber}
                            />
                        </div>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Region</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                onChange={(e) => setUtility({ ...utility, Region: e.target.value })}
                                defaultValue={utility?.Region}
                            />
                        </div>
                    </Col>

                    <Col md={6}>
                        <div className='pb-2 select'>
                            <Form.Label className='input-label'>Utility Type*</Form.Label>
                            <Form.Control 
                                as='select'
                                onChange={(e) => setUtility({ ...utility, UtilityTypeID: e.target.value })}    
                                value={utility?.UtilityTypeID}
                            >
                                <option></option>
                                {utilityTypes?.map((utilityType, index) => (
                                    <option 
                                        key={index} 
                                        value={utilityType.ID}
                                    >
                                        {utilityType.Name}
                                    </option>
                                ))}
                            </Form.Control>
                        </div>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Email</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                onChange={(e) => setUtility({ ...utility, EmailAddress: e.target.value })}
                                defaultValue={utility?.EmailAddress}
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
                        disabled={!utility.CompanyName || !utility.UtilityTypeID}
                        onClick={handleCreateUtility}
                    >
                        Save
                    </button>
                </div>
            </Modal.Body>
      </Modal>
    )
}

export default AddUtility;