import React, { useState, useEffect } from 'react';
import { getDocumentTypes } from '../../actions/documentActions';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Col } from 'react-bootstrap';
// import Utils from '../../utils';
import './Documents.scss';

// components
import MarketingBlock from '../MarketingBlock';
import FileUpload from '../FileUpload';

const Documents = (props) => {
    const dispatch = useDispatch();

    const [files, setFiles] = useState();

    const documentTypes = useSelector(state => state.document.documentTypes);
    const project = useSelector(state => state.project.project);
    console.log('Document Types', documentTypes, project);

    useEffect(() => {
        dispatch(getDocumentTypes());
    }, [dispatch])

    const onFileChange = (documentTypeID, e) => {
        // const files = e.target.files?.map((file) => {
        //     return {
                
        //     }
        // })
        console.log('Event', e.target.value, e);
        console.log('Doc Type ID', documentTypeID);
    }

    const findDocumentType = (name) => {
        // if (!isEmpty(documentTypes)) {     
            return documentTypes?.find((documentType) => documentType?.name === name);
        // } 
        // else {
        //     return {};
        // }
    }

    return (
        <div className='d-flex documents'>
            <div className='documents-container'>
                <div className='page-title'>Documents</div>


                <div className='d-flex documents-form'>
                    <Col>
                        <div className='pb-2'>
                            <FileUpload 
                                label={findDocumentType('Neighborhood Restrictions')?.name} 
                                onFileChange={onFileChange}
                                short 
                            />
                        </div>
                        <div className='pb-2'>
                            <FileUpload label='Plot of Lot' short />
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
                            <FileUpload label='Building Permit' short />
                        </div>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>Septic Permit #</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                defaultValue={project?.septicPermitNumber}
                            />
                        </div>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>Soil Treatment Contractor</Form.Label>
                            <Form.Control
                                className='input-gray'
                            />
                        </div>
                        <div>
                            <FileUpload label='Appraisal' short />
                        </div>
                    </Col>

                    <Col>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>Lot #</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                defaultValue={project?.lotNumber}
                            />
                        </div>
                        <div className='pb-2'>
                            <FileUpload label='Project Drawings' short />
                        </div>
                        <div className='pb-2'>
                            <FileUpload label='Certificate of Occupancy' short />
                        </div>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>Building Permit #</Form.Label>
                            <Form.Control
                                className='input-gray'
                                defaultValue={project?.buildingPermitNumber}
                            />
                        </div>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>Building Risk Policy</Form.Label>
                            <Form.Control
                                className='input-gray'
                            />
                        </div>
                        <div className='pb-2'>
                            <FileUpload label='Septic Permit' short />
                        </div>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>Tax Map #</Form.Label>
                            <Form.Control
                                className='input-gray'
                                defaultValue={project?.taxMapNumber}
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