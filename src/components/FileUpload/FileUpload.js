import React, { useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import './FileUpload.scss';

const FileUpload = (props) => {
    const { label, short, onFileChange, files } = props;

    const inputFile = useRef();

    const browse = () => {
        // clicks file upload input through button
        inputFile.current.click();
    }

    return (
        <div className='file-upload'>
            <div className={`${short && 'd-flex justify-content-between'}`}>
                <Form.Label className={`input-label ${short && 'label-margin'}`}>{label}</Form.Label>
                {short ? 
                    <div className='upload-btn add-btn'>
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
                        <div key={index} className='d-flex justify-content-between file'>
                            <div className='file-name'>
                                <a 
                                    href={file.url} 
                                    target='_blank'
                                    rel='noreferrer'
                                >
                                    {file.userFileName}
                                </a>
                            </div>
                            <div className='icon-container'><i className='far fa-pencil-alt'></i></div>
                            <div className='icon-container'><i className='fa fa-share-square'></i></div>
                            <div className='icon-container'><i className='far fa-trash-alt'></i></div>
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}

export default FileUpload;