import React from 'react';
import { Modal, Form, Col, Button } from 'react-bootstrap';
import './AddUtility.scss';

const AddUtility = (props) => {
    const { show, handleClose } = props;

    console.log('SHOW', props);

    return (
        <Modal 
            show={show} 
            onHide={() => handleClose()}
            centered
            className='add-utility'
            size='xl'
        >
            <Modal.Body>
                <div className='tab-item-title'>Add Utility</div>
                
                <div className='d-flex add-utility-form'>
                    <Col>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Utility Name</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                            />
                        </div>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Phone</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                            />
                        </div>
                    </Col>

                    <Col>
                        <div className='pb-2 select'>
                            <Form.Label className='input-label'>Utility Type</Form.Label>
                            <Form.Control as='select'>
                                <option></option>
                                {/* {subdivisions?.map((subdivision, index) => (
                                    <option key={index}>{subdivision.subdivisionName}</option>
                                ))} */}
                            </Form.Control>
                        </div>
                    </Col>
                </div>
                
                <div className='d-flex justify-content-center pt-5'>
                    <Button onClick={handleClose} variant='link' className='cancel'>Cancel</Button>
                    <button className='primary-gray-btn next-btn ml-3'>Next</button>
                </div>
            </Modal.Body>
      </Modal>
    )
}

export default AddUtility;