import React, { useEffect, useState } from 'react';
import { addDocument, getDocumentTypes, deleteDocument } from '../../actions/documentActions';
import { getProjectByProjectNumber, saveProject, setSelectedProjectTab } from '../../actions/projectActions';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Spinner } from 'react-bootstrap';
import Utils from '../../utils';
import './Documents.scss';

// components
import ClearChangesModal from '../ClearChangesModal';
import MarketingBlock from '../MarketingBlock';
import FileUpload from '../FileUpload';

const Documents = () => {
    const dispatch = useDispatch();

    const project = useSelector(state => state.project.project);
    const documentTypes = useSelector(state => state.document.documentTypes);

    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedInput, setSelectedInput] = useState();
    const [documentsInfo, setDocumentsInfo] = useState({ 
        ...project, 
        OccupencyDate: Utils.formatShortDateUS(project?.OccupencyDate),
        PermitDate: Utils.formatShortDateUS(project?.PermitDate)
    });

    useEffect(() => {
        dispatch(getDocumentTypes());
    }, [dispatch])

    const onFileChange = (documentTypeID, event) => {
        // Save new file / document
        const formData = new FormData();

        formData.append('DocumentTypeID', documentTypeID);
        formData.append('File', event.target?.files?.[0]);

        dispatch(addDocument(project.ID, formData))
            .then(() => {
                dispatch(getProjectByProjectNumber(project.ProjectNumber));
            });
    }

    const findDocumentType = (id) => {
        // return document type to use for label
        return documentTypes?.find((documentType) => documentType?.ID === id);
    }

    const findDocumentTypeFiles = (id) => {
        // return document list based on type
        return project?.Documents?.filter((document) => document?.DocumentTypeID === id);
    }

    const handleDocumentDelete = (documentID) => {
        // delete document by document ID then refresh project
        dispatch(deleteDocument(documentID))
            .then(() => {
                dispatch(getProjectByProjectNumber(project.ProjectNumber));
            });
    }

    const clearChanges = () => {
        //Reset changes to default
        setDocumentsInfo({ 
            ...project, 
            OccupencyDate: Utils.formatShortDateUS(project?.OccupencyDate),
            PermitDate: Utils.formatShortDateUS(project?.PermitDate)
        });

        setShowModal(false);
    }

    const saveChanges = () => {
        setIsLoading(true);

        const documentsInfoFinal = {
            ...documentsInfo,
            PermitDate: Utils.formatDate(documentsInfo.PermitDate),
            OccupencyDate: Utils.formatDate(documentsInfo.OccupencyDate)
        };

        // Save Project then navigate to utilities tab
        dispatch(saveProject(documentsInfoFinal))
            .then(() => {
                setIsLoading(false);
                dispatch(setSelectedProjectTab('utilities'));
            });
    }

    return (
        <div className='d-flex documents'>
            <div className='documents-container'>
                <div className='page-title'>Documents</div>

                <Form>
                    <div className='d-flex flex-wrap documents-form'>
                        <div className='form-col pb-2'>
                            <FileUpload 
                                short 
                                label={findDocumentType(1)?.Name} 
                                files={findDocumentTypeFiles(1)}
                                selectedInput={selectedInput}
                                setSelectedInput={setSelectedInput}
                                handleDocumentDelete={handleDocumentDelete}
                                onFileChange={(event) => onFileChange(1, event)}
                            />
                        </div>
                        <div className='form-col pb-2'>
                            <Form.Label className='input-label'>
                                Lot #
                            </Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                value={documentsInfo?.LotNumber}
                                onChange={(event) => setDocumentsInfo({
                                    ...documentsInfo,
                                    LotNumber: event.target.value
                                })}
                            />
                        </div>
                        <div className='form-col pb-2'>
                            <FileUpload 
                                short 
                                label={findDocumentType(2)?.Name}     
                                files={findDocumentTypeFiles(2)}
                                selectedInput={selectedInput}
                                setSelectedInput={setSelectedInput}
                                handleDocumentDelete={handleDocumentDelete}
                                onFileChange={(event) => onFileChange(2, event)}
                            />
                        </div>
                        <div className='form-col pb-2'>
                            <FileUpload 
                                short 
                                label={findDocumentType(7)?.Name}     
                                files={findDocumentTypeFiles(7)}
                                selectedInput={selectedInput}
                                setSelectedInput={setSelectedInput}
                                handleDocumentDelete={handleDocumentDelete}
                                onFileChange={(event) => onFileChange(7, event)}
                            />
                        </div>
                        <div className='form-col pb-2'>
                            <Form.Label className='input-label'>
                                C.O. Date
                            </Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                value={documentsInfo?.OccupencyDate}
                                onChange={(event) => setDocumentsInfo({
                                    ...documentsInfo,
                                    OccupencyDate: event.target.value
                                })}
                            />
                        </div>
                        <div className='form-col pb-2'>
                            <Form.Label className='input-label'>
                                Permit Date
                            </Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                value={documentsInfo?.PermitDate}
                                onChange={(event) => setDocumentsInfo({
                                    ...documentsInfo,
                                    PermitDate: event.target.value
                                })}
                            />
                        </div>
                        <div className='form-col pb-2'>
                            <Form.Label className='input-label'>
                                Building Permit #
                            </Form.Label>
                            <Form.Control
                                className='input-gray'
                                value={documentsInfo?.BuildingPermitNumber}
                                onChange={(event) => setDocumentsInfo({
                                    ...documentsInfo,
                                    BuildingPermitNumber: event.target.value
                                })}
                            />
                        </div>
                        <div className='form-col pb-2'>
                            <FileUpload 
                                short 
                                files={findDocumentTypeFiles(3)}
                                label={findDocumentType(3)?.Name}     
                                selectedInput={selectedInput}
                                setSelectedInput={setSelectedInput}
                                handleDocumentDelete={handleDocumentDelete}
                                onFileChange={(event) => onFileChange(3, event)}
                            />
                        </div>
                        <div className='form-col pb-2'>
                            <Form.Label className='input-label'>
                                Building Risk Policy
                            </Form.Label>
                            <Form.Control
                                className='input-gray'
                                value={documentsInfo?.BuildingRiskPolicy}
                                onChange={(event) => setDocumentsInfo({
                                    ...documentsInfo,
                                    BuildingRiskPolicy: event.target.value
                                })}
                            />
                        </div>
                        <div className='form-col pb-2'>
                            <Form.Label className='input-label'>Septic Permit #</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                value={documentsInfo?.SepticPermitNumber}
                                onChange={(event) => setDocumentsInfo({
                                    ...documentsInfo,
                                    SepticPermitNumber: event.target.value
                                })}
                            />
                        </div>
                        <div className='form-col pb-2'>
                            <FileUpload 
                                short 
                                files={findDocumentTypeFiles(9)}
                                label={findDocumentType(9)?.Name}     
                                selectedInput={selectedInput}
                                setSelectedInput={setSelectedInput}
                                handleDocumentDelete={handleDocumentDelete}
                                onFileChange={(event) => onFileChange(9, event)}
                            />
                        </div>
                        <div className='form-col pb-2'>
                            <Form.Label className='input-label'>Soil Treatment Contractor</Form.Label>
                            <Form.Control
                                className='input-gray'
                                value={documentsInfo?.SoilTreatmentContractor}
                                onChange={(event) => setDocumentsInfo({
                                    ...documentsInfo,
                                    SoilTreatmentContractor: event.target.value
                                })}
                            />
                        </div>
                        <div className='form-col pb-2'>
                            <Form.Label className='input-label'>
                                Tax Map #
                            </Form.Label>
                            <Form.Control
                                className='input-gray'
                                value={documentsInfo?.TaxMapNumber}
                                onChange={(event) => setDocumentsInfo({
                                    ...documentsInfo,
                                    TaxMapNumber: event.target.value
                                })}
                            />
                        </div>
                        <div className='form-col pb-2'>
                            <FileUpload 
                                short 
                                files={findDocumentTypeFiles(4)} 
                                label={findDocumentType(4)?.Name}    
                                selectedInput={selectedInput}
                                setSelectedInput={setSelectedInput}
                                handleDocumentDelete={handleDocumentDelete}
                                onFileChange={(event) => onFileChange(4, event)}
                            />
                        </div>
                    </div>
                </Form>

                <ClearChangesModal 
                    show={showModal}
                    setShow={setShowModal}
                    clearChanges={clearChanges}
                />

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
                                onClick={() => setShowModal(true)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className='primary-gray-btn next-btn ml-3'
                                onClick={saveChanges}
                            >
                                Next
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <MarketingBlock />
        </div>
    );
}

export default Documents;