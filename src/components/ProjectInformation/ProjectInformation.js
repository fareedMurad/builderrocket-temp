import React from 'react';
import { Container, Form, Col, Row } from 'react-bootstrap';
import Utils from '../../utils';
import './ProjectInformation.scss';

// import FileUpload from '../FileUpload';

const ProjectInformation = (props) => {
    const { project } = props;

    return (
        <Container className='project-information'> 
            <div id='title'>Project Information</div>

            <Row>
                <Col md={6}>
                    <div className='pb-4'>
                        <Form.Label className='input-label'>Project Name</Form.Label>
                        <Form.Control
                            type='email'
                            className='input-gray'
                            defaultValue={project?.projectName}
                        />
                    </div>
                    <div className='pb-4'>
                        <Form.Label className='input-label'>Customer Name</Form.Label>
                        <Form.Control
                            type='email'
                            className='input-gray'
                        />
                    </div>
                    <div className='pb-4'>
                        <Form.Label className='input-label'>Plan Name</Form.Label>
                        <Form.Control
                            type='email'
                            className='input-gray'
                        />
                    </div>
                    <div className='pb-2'>
                        <Form.Label className='input-label'>Subdivision</Form.Label>
                        <Form.Control
                            type='email'
                            className='input-gray'
                        />
                    </div>
                    <div className='pb-2'>
                        <Form.Label className='input-label'>Street Address 1</Form.Label>
                        <Form.Control
                            type='email'
                            className='input-gray'
                            defaultValue={project?.streetAddress1}
                        />
                    </div>
                    <div className='pb-2'>
                        <Form.Label className='input-label'>City</Form.Label>
                        <Form.Control
                            type='email'
                            className='input-gray'
                        />
                    </div>
                    <div className='pb-4'>
                        <Form.Label className='input-label'>Zip Code</Form.Label>
                        <Form.Control
                            type='email'
                            className='input-gray'
                            defaultValue={project?.zip}
                        />
                    </div>
                    <div>
                        <Form.Label className='input-label'>Closing Date</Form.Label>
                        <Form.Control
                            type='email'
                            className='input-gray'
                            defaultValue={Utils.formatDateDashes(project?.closeCreated)}
                        />
                    </div>
                </Col>

                <Col md={6}>
                    <div className='pb-4'>
                        <Form.Label className='input-label'>Project Image</Form.Label>
                        <Form.Control
                            type='email'
                            className='input-gray'
                        />
                        {/* <Form.File 
                            id='custom-file'
                            label=''
                            className='file-input'
                            custom
                        /> */}
                        {/* <FileUpload /> */}
                    </div>
                    <div className='pb-4'>
                        <Form.Label className='input-label'>Customer Email</Form.Label>
                        <Form.Control
                            type='email'
                            className='input-gray'
                        />
                    </div>
                    <div className='pb-4'>
                        <Form.Label className='input-label'>Project Status</Form.Label>
                        <Form.Control
                            type='email'
                            className='input-gray'
                        />
                    </div>
                    <div className='pb-5 pt-3'></div>
                    <div className='pb-2'>
                        <Form.Label className='input-label'>Street Address2</Form.Label>
                        <Form.Control
                            type='email'
                            className='input-gray'
                            defaultValue={project?.streetAddress2}
                        />
                    </div>

                    <div className='pb-4'>
                        <Form.Label className='input-label'>State</Form.Label>
                        <Form.Control
                            type='email'
                            className='input-gray'
                            defaultValue={project?.state}
                        />
                    </div>
                </Col>
            </Row>

            <div className='d-flex justify-content-center pt-5'>
                <a href='/' className='cancel'>Cancel</a>
                <button className='primary-gray-btn next-btn ml-3'>Next</button>
            </div>
        </Container>
    )
}

export default ProjectInformation;