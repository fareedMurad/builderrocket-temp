import React from 'react';
import { Form } from 'react-bootstrap';
import './FileUpload.scss';

const FileUpload = (props) => {
    const { label, short } = props;

    return (
        <div className={`file-upload ${short && 'd-flex'}`}>
            <Form.Label className={`input-label ${short && 'mt-1'}`}>{label}</Form.Label>
            {short ? 
                <div className='upload-btn ml-3'>
                    <label htmlFor='actual-btn'>Browse</label>
                    <input type='file' id='actual-btn' hidden />
                </div>
            :
                <label className='custom-file-label'>
                    <input type='file' />
                </label>
            }
        </div>
    )
}

export default FileUpload;