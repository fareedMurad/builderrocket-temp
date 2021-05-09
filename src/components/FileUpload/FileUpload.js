import React from 'react';
import { Form } from 'react-bootstrap';
import './FileUpload.scss';


const FileUpload = (props) => {
    const { label } = props;

    return (
        <div className='file-upload'>
            <Form.Label className='input-label'>{label}</Form.Label>
            
            <Form.File
                type='file'
                className='custom-file-label'
                custom
            />
        </div>
    )
}

export default FileUpload;