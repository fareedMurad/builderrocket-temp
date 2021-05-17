import React, { useEffect } from 'react';
import { Modal, Form, Col, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getUtilityTypes } from '../../actions/utilityActions';
import './AddUtility.scss';

const AddUtility = (props) => {
    const { show, handleClose } = props;

    const dispatch = useDispatch();

    const utilityTypes = useSelector(state => state.utility.utilityTypes);
    console.log('Utility Types', utilityTypes);

    useEffect(() => {
        dispatch(getUtilityTypes());
    }, [dispatch]);

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
                                {utilityTypes?.map((utilityType, index) => (
                                    <option key={index}>{utilityType.name}</option>
                                ))}
                            </Form.Control>
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
                    <button className='primary-gray-btn next-btn ml-3'>Next</button>
                </div>
            </Modal.Body>
      </Modal>
    )
}

export default AddUtility;