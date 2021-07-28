import React, { useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { renameDocument } from '../../actions/documentActions';
import { getProjectByProjectNumber } from '../../actions/projectActions';
import './FileUpload.scss';

const FileUpload = (props) => {
    const { 
        label, 
        short, 
        files, 
        onFileChange, 
        selectedInput, 
        setSelectedInput,
        handleDocumentDelete,  
    } = props;

    const dispatch = useDispatch();
    const inputFile = useRef();

    const project = useSelector(state => state.project.project);

    const [newDocumentName, setNewDocumentName] = useState('');

    const browse = () => {
        // clicks file upload input through button
        inputFile.current.click();
    }

    const updateDocumentName = (fileID) => {
        dispatch(renameDocument())
            .then(() => {
                dispatch(getProjectByProjectNumber(project.ProjectNumber));
            })
    }

    const clearInput = () => {
        setSelectedInput();
        setNewDocumentName('');
    }

    console.log('input list', selectedInput);

    return (
        <div className='file-upload'>
            <div className={`${short && 'd-flex justify-content-between'}`}>
                <Form.Label className={`input-label ${short && 'label-margin'}`}>{label}</Form.Label>
                {short ? 
                    <div className='upload-btn'>
                        <Button 
                            variant='link' 
                            className='link-btn' 
                            onClick={browse}
                        >
                            + Add File
                        </Button>
                        <input 
                            type='file' 
                            id='actual-btn' 
                            ref={inputFile} 
                            onChange={onFileChange}
                            hidden 
                        />
                    </div>
                :
                    <label className='custom-file-label'>
                        <input type='file' onChange={onFileChange} />
                    </label>
                }
            </div>

            {short && 
                <div className='files-container'>
                    {files && files?.map((file, index) => (
                        <div 
                            key={index} 
                            className='d-flex justify-content-between file'
                        >
                            {selectedInput === file?.ID ? (
                                <div className='file-input'>
                                    <Form.Control 
                                        value={newDocumentName}
                                        onChange={(event) => setNewDocumentName(event.target.value)}
                                    />
                                </div>
                            ) : (
                                <div className='file-name'>
                                    <a 
                                        href={file?.URL} 
                                        target='_blank'
                                        rel='noreferrer'
                                    >
                                        {file.UserFileName}
                                    </a>
                                </div>
                            )}

                            {selectedInput === file?.ID ? (
                                <>
                                    <div className='icon-container'></div>
                                    <div className='icon-container'><i className='fa fa-check'></i></div>
                                    <div 
                                        className='icon-container'
                                        onClick={clearInput}
                                    >
                                        <i className='fa fa-times'></i>
                                    </div>
                                </>
                            ) : (
                            <>
                                <div 
                                    className='icon-container'
                                    onClick={() => setSelectedInput(file?.ID)}
                                >
                                    <i className='far fa-pencil-alt'></i>
                                </div>
                                <div className='icon-container'><i className='fa fa-share-square'></i></div>
                                <div className='icon-container'>
                                    <i onClick={() => handleDocumentDelete(file?.ID)} className='far fa-trash-alt'></i>
                                </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}

export default FileUpload;