import React from 'react';
import { Form } from 'react-bootstrap';
import './FileUpload.scss';

const FileUpload = (props) => {
    const { label } = props;

    return (
        <div className='file-upload'>
            <Form.Label className='input-label'>{label}</Form.Label>

            <label class='custom-file-label'>
                <input type='file' />
            </label>
        </div>
    )
}

export default FileUpload;