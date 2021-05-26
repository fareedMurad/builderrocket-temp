import React, { useEffect } from 'react';
import { addDocument, getDocumentTypes, deleteDocument } from '../../actions/documentActions';
import { getProjectByProjectNumber } from '../../actions/projectActions';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Col } from 'react-bootstrap';
import Utils from '../../utils';
import './Documents.scss';

// components
import MarketingBlock from '../MarketingBlock';
import FileUpload from '../FileUpload';

const Documents = (props) => {
    const dispatch = useDispatch();

    const documentTypes = useSelector(state => state.document.documentTypes);
    const project = useSelector(state => state.project.project);

    useEffect(() => {
        dispatch(getDocumentTypes());
    }, [dispatch])

    const onFileChange = (documentTypeID, event) => {
        const formData = new FormData();

        formData.append('DocumentTypeID', documentTypeID);
        formData.append('File', event.target?.files?.[0]);

        dispatch(addDocument(project.id, formData))
            .then(() => {
                dispatch(getProjectByProjectNumber(project.projectNumber));
            });
    }

    const findDocumentType = (id) => {
        return documentTypes?.find((documentType) => documentType?.ID === id);
    }

    const findDocumentTypeFiles = (id) => {
        return project?.Documents?.filter((document) => document?.DocumentTypeID === id);
    }

    const handleDocumentDelete = (documentID) => {
        dispatch(deleteDocument(documentID))
            .then(() => {
                dispatch(getProjectByProjectNumber(project.ProjectNumber));
            });
    }

    return (
        <div className='d-flex documents'>
            <div className='documents-container'>
                <div className='page-title'>Documents</div>


                <div className='d-flex flex-wrap documents-form'>
                    <Col md={6} lg={6}>
                        <div className='pb-2'>
                            <FileUpload 
                                label={findDocumentType(1)?.Name} 
                                onFileChange={(event) => onFileChange(1, event)}
                                handleDocumentDelete={handleDocumentDelete}
                                files={findDocumentTypeFiles(1)}
                                short 
                            />
                        </div>
                        <div className='pb-2'>
                            <FileUpload 
                                label={findDocumentType(2)?.Name}     
                                onFileChange={(event) => onFileChange(2, event)}
                                handleDocumentDelete={handleDocumentDelete}
                                files={findDocumentTypeFiles(2)}
                                short 
                            />
                        </div>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>C.O. Date</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                defaultValue={Utils.formatShortDateUS(project?.OccupencyDate)}
                            />
                        </div>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>Permit Date</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                defaultValue={Utils.formatShortDateUS(project?.PermitDate)}
                            />
                        </div>
                        <div className='pb-2'>
                            <FileUpload 
                                label={findDocumentType(3)?.Name}     
                                onFileChange={(event) => onFileChange(3, event)}
                                handleDocumentDelete={handleDocumentDelete}
                                files={findDocumentTypeFiles(3)}
                                short 
                            />
                        </div>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>Septic Permit #</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                defaultValue={project?.SepticPermitNumber}
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
                                label={findDocumentType(4)?.Name}    
                                onFileChange={(event) => onFileChange(4, event)}
                                handleDocumentDelete={handleDocumentDelete}
                                files={findDocumentTypeFiles(4)} 
                                short 
                            />
                        </div>
                    </Col>

                    <Col md={6} lg={6}>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>Lot #</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                defaultValue={project?.LotNumber}
                            />
                        </div>
                        <div className='pb-2'>
                            <FileUpload 
                                label={findDocumentType(7)?.Name}     
                                onFileChange={(event) => onFileChange(7, event)}
                                handleDocumentDelete={handleDocumentDelete}
                                files={findDocumentTypeFiles(7)}
                                short 
                            />
                        </div>
                        <div className='pb-2'>
                            <FileUpload 
                                label={findDocumentType(8)?.Name}  
                                onFileChange={(event) => onFileChange(8, event)}
                                handleDocumentDelete={handleDocumentDelete}
                                files={findDocumentTypeFiles(8)}   
                                short 
                            />
                        </div>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>Building Permit #</Form.Label>
                            <Form.Control
                                className='input-gray'
                                defaultValue={project?.BuildingPermitNumber}
                            />
                        </div>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>Building Risk Policy</Form.Label>
                            <Form.Control
                                className='input-gray'
                                defaultValue={project?.BuildingRiskPolicy}
                            />
                        </div>
                        <div className='pb-2'>
                            <FileUpload 
                                label={findDocumentType(9)?.Name}     
                                onFileChange={(event) => onFileChange(9, event)}
                                handleDocumentDelete={handleDocumentDelete}
                                files={findDocumentTypeFiles(9)}
                                short 
                            />
                        </div>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>Tax Map #</Form.Label>
                            <Form.Control
                                className='input-gray'
                                defaultValue={project?.TaxMapNumber}
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