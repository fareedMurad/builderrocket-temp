import React, { useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import './FileUpload.scss';

const FileUpload = (props) => {
    const { label, short, onFileChange } = props;

    const inputFile = useRef();

    const browse = () => {
        // clicks file upload input through button
        inputFile.current.click();
    }

    return (
        <div className='file-upload '>
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

                </div>
            }
        </div>
    )
}

export default FileUpload;