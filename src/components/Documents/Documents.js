import React from 'react';
import { Form, Col } from 'react-bootstrap';
// import Utils from '../../utils';
import './Documents.scss';

// components
import MarketingBlock from '../MarketingBlock';
import FileUpload from '../FileUpload';

const Documents = (props) => {

    return (
        <div className='d-flex documents'>
            <div className='documents-container'>
                <div className='page-title'>Documents</div>


                <div className='d-flex documents-form'>
                    <Col>
                        <div className='pb-2'>
                            <FileUpload label='Neighborhood Restrictions' short />
                        </div>
                        <div className='pb-2'>
                            <FileUpload label='Plot of Lot' />
                        </div>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>C.O. Date</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                            />
                        </div>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>Permit Date</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                            />
                        </div>
                        <div className='pb-2'>
                            <FileUpload label='Building Permit' />
                        </div>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>Septic Permit #</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                            />
                        </div>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>Soil Treatment Contractor</Form.Label>
                            <Form.Control
                                className='input-gray'
                            />
                        </div>
                        <div>
                            <FileUpload label='Appraisal' />
                        </div>
                    </Col>

                    <Col>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>Lot #</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                            />
                        </div>
                        <div className='pb-2'>
                            <FileUpload label='Project Drawings' />
                        </div>
                        <div className='pb-2'>
                            <FileUpload label='Certificate of Occupancy' />
                        </div>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>Building Permit #</Form.Label>
                            <Form.Control
                                className='input-gray'
                            />
                        </div>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>Building Risk Policy</Form.Label>
                            <Form.Control
                                className='input-gray'
                            />
                        </div>
                        <div className='pb-2'>
                            <FileUpload label='Septic Permit' />
                        </div>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>Tax Map #</Form.Label>
                            <Form.Control
                                className='input-gray'
                            />
                        </div>
                    </Col>
                </div>

                <div className='d-flex justify-content-center pt-5'>
                    <a href='/' className='cancel'>Cancel</a>
                    <button className='primary-gray-btn next-btn ml-3'>Next</button>
                </div>
            </div>

            <MarketingBlock />
        </div>
    );
}

export default Documents;