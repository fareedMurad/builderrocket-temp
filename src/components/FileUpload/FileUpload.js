import React, { useRef, useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { renameDocument } from '../../actions/documentActions';
import { getProjectByProjectNumber } from '../../actions/projectActions';
import './FileUpload.scss';

const FileUpload = (props) => {
    const { 
        label, 
        short, 
        files, 
        fileURL, 
        placeholder,
        onFileChange, 
        selectedInput, 
        setSelectedInput,
        handleDocumentDelete,  
    } = props;

    const dispatch = useDispatch();
    const inputFile = useRef();

    const project = useSelector(state => state.project.project);

    const [newFileName, setNewFileName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const browse = () => {
        // clicks file upload input through button
        inputFile.current.click();
    }

    const updateFileName = (fileID) => {
        if (!fileID) return;

        setIsLoading(true);

        const fileNameObj = {
            userFileName: newFileName
        }

        dispatch(renameDocument(fileID, fileNameObj))
            .then(() => clearInput())
            .then(() => dispatch(getProjectByProjectNumber(project.ProjectNumber)))
            .then(() => setIsLoading(false));
    }

    const clearInput = () => {
        setNewFileName('');
        
        setSelectedInput();
    }

    const handleShowInput = (fileID) => {
        setNewFileName('');

        setSelectedInput(fileID);
    }
    console.log('PLACE HOLDER', placeholder);

    return (
        <div className='file-upload'>
            <div className={`${short && 'd-flex justify-content-between'}`}>
                <Form.Label className={`input-label ${short && 'label-margin'}`}>{label}</Form.Label>
                {short ? (
                    <div className='upload-btn'>
                        <Button 
                            variant='link' 
                            className='link-btn' 
                            onClick={browse}
                        >
                            + Add File
                        </Button>
                        <input 
                            hidden 
                            type='file' 
                            id='actual-btn' 
                            ref={inputFile} 
                            onChange={onFileChange}
                        />
                    </div>
                ) : (
                    <label className='custom-file-label'>
                        <input type='file' onChange={onFileChange} />
                    </label>
                )}
            </div>

            {short && (
                <div className='files-container'>
                    <div className='file-name'>
                        {placeholder && (
                            <a 
                               href={fileURL} 
                               target='_blank'
                               rel='noreferrer'
                            >
                               {placeholder}
                           </a>
                        )}
                    </div>
                    {files && files?.map((file, index) => (
                        <div 
                            key={index} 
                            className='d-flex justify-content-between file'
                        >
                            {selectedInput === file?.ID ? (
                                <>
                                    {!isLoading && (
                                        <div className='file-input'>
                                            <Form.Control 
                                                value={newFileName}
                                                onChange={(event) => setNewFileName(event.target.value)}
                                            />
                                        </div>
                                    )}
                                </>
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
                                    {isLoading ? (
                                        <div className='icon-container'>
                                            <Spinner 
                                                size='sm' 
                                                variant='primary'
                                                animation='border' 
                                            />
                                        </div>
                                    ) : (
                                    <>
                                        <div className='icon-container'></div>
                                        <div 
                                            className='icon-container'
                                            onClick={() => updateFileName(file?.ID)}
                                        >
                                            <i className='fa fa-check'></i>
                                        </div>
                                        <div 
                                            className='icon-container'
                                            onClick={clearInput}
                                        >
                                            <i className='fa fa-times'></i>
                                        </div>
                                    </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div 
                                        className='icon-container'
                                        onClick={() => handleShowInput(file?.ID)}
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
            )}
        </div>
    )
}

export default FileUpload;