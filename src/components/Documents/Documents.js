import React, { useState, useEffect } from 'react';
import { getDocumentTypes } from '../../actions/documentActions';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Col } from 'react-bootstrap';
import Utils from '../../utils';
import './Documents.scss';

// components
import MarketingBlock from '../MarketingBlock';
import FileUpload from '../FileUpload';

const Documents = (props) => {
    const dispatch = useDispatch();

    const [files, setFiles] = useState();

    const documentTypes = useSelector(state => state.document.documentTypes);
    const project = useSelector(state => state.project.project);
    console.log('Project', project);

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

    const findDocumentType = (id) => {  
        return documentTypes?.find((documentType) => documentType?.id === id);
    }

    const findDocumentTypeFiles = (id) => {
        return project?.documents?.filter((document) => document?.documentTypeID === id);
    }

    return (
        <div className='d-flex documents'>
            <div className='documents-container'>
                <div className='page-title'>Documents</div>


                <div className='d-flex flex-wrap documents-form'>
                    <Col md={6}>
                        <div className='pb-2'>
                            <FileUpload 
                                label={findDocumentType(1)?.name} 
                                onFileChange={onFileChange}
                                files={findDocumentTypeFiles(1)}
                                short 
                            />
                        </div>
                        <div className='pb-2'>
                            <FileUpload 
                                label={findDocumentType(2)?.name}     
                                files={findDocumentTypeFiles(2)}
                                short 
                            />
                        </div>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>C.O. Date</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                defaultValue={Utils.formatShortDateUS(project?.occupencyDate)}
                            />
                        </div>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>Permit Date</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                defaultValue={Utils.formatShortDateUS(project?.permitDate)}
                            />
                        </div>
                        <div className='pb-2'>
                            <FileUpload 
                                label={findDocumentType(3)?.name}     
                                files={findDocumentTypeFiles(3)}
                                short 
                            />
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
                            <FileUpload 
                                label={findDocumentType(4)?.name}    
                                files={findDocumentTypeFiles(4)} 
                                short 
                            />
                        </div>
                    </Col>

                    <Col md={6}>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>Lot #</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                defaultValue={project?.lotNumber}
                            />
                        </div>
                        <div className='pb-2'>
                            <FileUpload 
                                label={findDocumentType(7)?.name}     
                                files={findDocumentTypeFiles(7)}
                                short 
                            />
                        </div>
                        <div className='pb-2'>
                            <FileUpload 
                                label={findDocumentType(8)?.name}  
                                files={findDocumentTypeFiles(8)}   
                                short 
                            />
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
                                defaultValue={project?.buildingRiskPolicy}
                            />
                        </div>
                        <div className='pb-2'>
                            <FileUpload 
                                label={findDocumentType(9)?.name}     
                                files={findDocumentTypeFiles(9)}
                                short 
                            />
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

            <div className='d-flex'>
                <MarketingBlock />
            </div>
        </div>
    );
}

export default Documents;