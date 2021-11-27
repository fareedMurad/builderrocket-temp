import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Spinner, Form } from 'react-bootstrap';
import { addDocument, deleteDocument, renameDocument } from '../../actions/documentActions';
import { getProjectByProjectID } from '../../actions/projectActions';
import './Drawings.scss';

// components
import MarketingBlock from '../MarketingBlock';

const Drawings = () => {
    const dispatch = useDispatch();

    const project = useSelector(state => state.project.project);

    const [isLoading, setIsLoading] = useState(false);
    const [newDrawingName, setNewDrawingName] = useState('');
    const [selectedDrawing, setSelectedDrawing] = useState();
    const [isLoadingDrawing, setIsLoadingDrawing] = useState(false);

    const inputFile = useRef();

    const browse = () => {
        // clicks file upload input through button
        inputFile.current.click();
    }

    const returnDrawings = () => {
        const drawings = project?.Documents?.filter((document) => {
            return document.DocumentTypeName === 'Drawings';
        });

        if (drawings?.length > 0) return drawings;

        return [];
    }

    const onFileChange = (event) => {
        if (!project?.ID) return alert('Select project and try again');

        setIsLoading(true);

        // Drawings Document TypeID
        const documentTypeID = 11;
        // Save new file / document
        const formData = new FormData();

        formData.append('DocumentTypeID', documentTypeID);
        formData.append('File', event.target?.files?.[0]);

        dispatch(addDocument(project.ID, formData))
            .then(() => {
                dispatch(getProjectByProjectID(project.ID));
                setIsLoading(false);
            })
            .catch(() => {
                alert('Something went wrong uploading drawing, please try again');
                setIsLoading(false);
            });
    }

    const updateFileName = (drawingID) => {
        if (!drawingID) return;

        setIsLoadingDrawing(true);

        const drawingNameObj = {
            userFileName: newDrawingName
        }

        dispatch(renameDocument(drawingID, drawingNameObj))
            .then(() => clearInput())
            .then(() => dispatch(getProjectByProjectID(project.ID)))
            .then(() => setIsLoadingDrawing(false))
            .catch(() => {
                alert('Something went wrong updating document name');
                setIsLoadingDrawing(false);
            });
    }

    const clearInput = () => {
        setNewDrawingName('');
        setSelectedDrawing();
    }

    const handleDrawingDelete = (drawingID) => {
        if (!project?.ID) return;

        setIsLoading(true);
        // delete document by document ID then refresh project
        dispatch(deleteDocument(drawingID))
            .then(() => {
                dispatch(getProjectByProjectID(project.ID));
                setIsLoading(false);
            })
            .catch(() => {
                alert('Something went wrong deleting drawing try again');
                setIsLoading(false);
            });
    }

    const handleRenderImage = (drawing) => {
        if (
            drawing?.FileName.endsWith('.png')
            || drawing?.FileName.endsWith('.jpg')
            || drawing?.FileName.endsWith('.pdf')
            || drawing?.FileName.endsWith('.bmp')
        ) {
            return true;
        }

        return;
    }

    return (
        <div className='d-flex drawings'>
            <div className='drawings-container'>
                <div className='d-flex'>
                    <div className='page-title'>Drawings</div>

                    <div className='ml-1'>
                        <Button 
                            variant='link' 
                            className='link-btn'
                            onClick={browse}
                        >
                            + Add Drawings
                        </Button>
                        <input 
                            hidden 
                            type='file' 
                            id='actual-btn' 
                            ref={inputFile} 
                            onChange={onFileChange}
                        />
                    </div> 
                </div>

                <div className='drawings-form'>
                    {isLoading ? (
                        <div className='spinner d-flex justify-content-center'>
                            <Spinner 
                                animation='border'
                                variant='primary' 
                            />
                        </div>
                    ) : (
                        <>
                            {returnDrawings()?.map((drawing, index) => (
                                <div key={index} className='d-flex drawing'>
                                    <div className='drawing-image'>       
                                        {handleRenderImage(drawing) ? (
                                            <img 
                                                alt='drawing' 
                                                height='45' 
                                                width='50' 
                                                src={drawing?.URL}
                                            />
                                        ) : (
                                            <div className='drawing-image-icon'>
                                                <i className={`far fa-${drawing?.Icon}`}></i>
                                            </div>
                                        )}
                                    </div>

                                    {selectedDrawing === drawing?.ID ? (
                                        <div className='d-flex justify-content-between edit-drawings-container'>
                                            <div className='file-input'>
                                                <Form.Control 
                                                    value={newDrawingName}
                                                    onChange={(event) => setNewDrawingName(event.target.value)}
                                                />
                                            </div>
                                            {isLoadingDrawing ? (
                                                <div className='spinner-container'>
                                                    <Spinner 
                                                        size='sm' 
                                                        variant='primary'
                                                        animation='border' 
                                                    />
                                                </div>
                                            ) : (
                                                <div className='icon-container'>
                                                    <div className='icon-container'></div>
                                                    <div 
                                                        className='icon-container'
                                                        onClick={() => updateFileName(drawing?.ID)}
                                                    >
                                                        <i className='fa fa-check'></i>
                                                    </div>
                                                    <div 
                                                        className='icon-container'
                                                        onClick={clearInput}
                                                    >
                                                        <i className='fa fa-times'></i>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className='d-flex justify-content-between name-icons'>
                                            <div className='drawing-name'>
                                                <a 
                                                    href={drawing?.URL} 
                                                    target='_blank'
                                                    rel='noreferrer'
                                                >
                                                    {drawing?.UserFileName}
                                                </a>
                                            </div>
                                            <div className='d-flex icon-container'>
                                                <div 
                                                    className='icon'
                                                    onClick={() => setSelectedDrawing(drawing?.ID)}
                                                >
                                                        <i className='far fa-pencil-alt'></i>
                                                </div>
                                                <div className='icon'><i className='fa fa-share-square'></i></div>
                                                <div className='icon'>
                                                    <i 
                                                        onClick={() => handleDrawingDelete(drawing?.ID)}
                                                        className='far fa-trash-alt'
                                                    ></i>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>

            <MarketingBlock />
        </div>
    );
}

export default Drawings;
