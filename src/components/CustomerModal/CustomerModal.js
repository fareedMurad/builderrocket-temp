import React, { useEffect, useState } from 'react';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import './CustomerModal.scss';

const CustomerModal = ({ show, setShow, setCustomer, project }) => {    
    const customer = project?.Customers?.[0];

    const [editedCustomer, setEditedCustomer] = useState({ 
        FirstName: customer?.FirstName, 
        LastName: customer?.LastName, 
        Email: customer?.Email,
        Phone: customer?.Phone
    });

    useEffect(() => {
        // Set customer on opening of modal
        setEditedCustomer({
            FirstName: customer?.FirstName, 
            LastName: customer?.LastName, 
            Email: customer?.Email,
            Phone: customer?.Phone
        });
    }, [customer]);

    const saveChanges = () => {
        const updatedProject = {
            ...project,
            Customers: [{
                ...customer,
                ...editedCustomer
            }]
        }

        setCustomer(updatedProject);
        setShow(false);
    }

    const cancelChanges = () => {
        // // reset customer to initial state
        setEditedCustomer({
            FirstName: customer?.FirstName, 
            LastName: customer?.LastName, 
            Email: customer?.Email,
            Phone: customer?.Phone
        });

        setShow(false);
    }

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
                    <Button 
                        variant='link' 
                        className='cancel'
                        onClick={cancelChanges}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={saveChanges}
                        className='primary-gray-btn next-btn ml-3'
                    >
                        Ok
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default CustomerModal;
