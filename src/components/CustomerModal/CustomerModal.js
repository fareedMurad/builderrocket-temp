import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Form, Row, Col, Button, Spinner } from 'react-bootstrap';
import { saveProject } from '../../actions/projectActions';
import './CustomerModal.scss';

const CustomerModal = ({ show, setShow }) => {
    const dispatch = useDispatch();

    const project = useSelector(state => state.project.project);
    
    const customer = project.Customers?.[0];

    const [isLoading, setIsLoading] = useState(false);
    const [editedCustomer, setEditedCustomer] = useState({ 
        FirstName: customer.FirstName, 
        LastName: customer.LastName, 
        Email: customer.Email,
        Phone: customer.Phone
    });


    const saveChanges = () => {
        setIsLoading(true);

        const updatedProject = {
            ...project,
            Customers: [{
                ...customer,
                ...editedCustomer
            }]
        }

        dispatch(saveProject(updatedProject))
            .then(() => {
                setIsLoading(false);
                setShow(false);
            });
    }

    console.log('project', project);

    return (
        <Modal
            centered    
            size='lg'
            show={show}
            className='customer-modal'
            onHide={() => setShow(false)}
        >
            <Modal.Body>
                <div className='page-title'>Edit Customer</div>

                <Row>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className='input-label'>First Name</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                value={editedCustomer?.FirstName}
                                onChange={(event) => setEditedCustomer({ 
                                    ...editedCustomer, 
                                    FirstName: event.target.value 
                                })}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className='input-label'>Last Name</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                value={editedCustomer?.LastName}
                                onChange={(event) => setEditedCustomer({ 
                                    ...editedCustomer, 
                                    LastName: event.target.value 
                                })}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className='input-label'>Email</Form.Label>
                            <Form.Control
                                type='text'
                                inputMode='email'
                                className='input-gray'
                                value={editedCustomer?.Email}
                                onChange={(event) => setEditedCustomer({ 
                                    ...editedCustomer, 
                                    Email: event.target.value 
                                })}
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
                                value={editedCustomer?.Phone}
                                onChange={(event) => setEditedCustomer({ 
                                    ...editedCustomer, 
                                    Phone: event.target.value 
                                })}
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
                                onClick={() => setShow(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={saveChanges}
                                className='primary-gray-btn next-btn ml-3'
                            >
                                Save
                            </Button>
                        </>
                    )}
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default CustomerModal;
