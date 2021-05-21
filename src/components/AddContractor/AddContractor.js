import React, { useState } from 'react';
import { Modal, Form, Col, Button } from 'react-bootstrap';
import './AddContractor.scss';


const AddContractor = (props) => {
    const { show, handleClose, handleCreateContractor } = props;

    const [contractor, setContractor] = useState({})

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
                
                <div className='d-flex add-contractor-form'>
                    <Col md={6}>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Company Name*</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                onChange={(e) => setContractor({ ...contractor, companyName: e.target.value })}
                            />
                        </div>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>City/State</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                onChange={(e) => setContractor({ ...contractor, cityState: e.target.value })}
                            />
                        </div>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Phone</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                onChange={(e) => setContractor({ ...contractor, phoneNumber: e.target.value })}
                            />
                        </div>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Categories</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                onChange={(e) => setContractor({ ...contractor, region: e.target.value })}
                            />
                        </div>
                    </Col>

                    <Col md={6}> 
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Contact Name</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                onChange={(e) => setContractor({ ...contractor, firstName: e.target.value })}
                            />
                        </div>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>ZIP Code</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                onChange={(e) => setContractor({ ...contractor, zip: e.target.value })}
                            />
                        </div>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Email</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                onChange={(e) => setContractor({ ...contractor, email: e.target.value })}
                            />
                        </div>
                        <div className='pb-2 select'>
                            <Form.Label className='input-label'>UOM</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                onChange={(e) => setContractor({ ...contractor, uom: e.target.value })}
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