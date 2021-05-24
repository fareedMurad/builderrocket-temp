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

    console.log('utility', utility);

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
                
                <div className='d-flex add-utility-form'>
                    <Col md={6}>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Utility Name*</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                onChange={(e) => setUtility({ ...utility, companyName: e.target.value })}
                                defaultValue={utility?.companyName}
                            />
                        </div>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Phone</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                onChange={(e) => setUtility({ ...utility, phoneNumber: e.target.value })}
                                defaultValue={utility?.phoneNumber}
                            />
                        </div>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Region</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                onChange={(e) => setUtility({ ...utility, region: e.target.value })}
                                defaultValue={utility?.region}
                            />
                        </div>
                    </Col>

                    <Col md={6}>
                        <div className='pb-2 select'>
                            <Form.Label className='input-label'>Utility Type*</Form.Label>
                            <Form.Control 
                                as='select'
                                onChange={(e) => setUtility({ ...utility, utilityTypeID: e.target.value })}    
                                value={utility?.utilityTypeID}
                            >
                                <option></option>
                                {utilityTypes?.map((utilityType, index) => (
                                    <option 
                                        key={index} 
                                        value={utilityType.id}
                                    >
                                        {utilityType.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </div>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Email</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                onChange={(e) => setUtility({ ...utility, emailAddress: e.target.value })}
                                defaultValue={utility?.emailAddress}
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
                        disabled={!utility.companyName || !utility.utilityTypeID}
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