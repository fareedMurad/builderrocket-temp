import React from 'react';
import { Form } from 'react-bootstrap';
import './FileUpload.scss';


const FileUpload = (props) => {

    return (
        <div className='file-upload'>
            <Form.Label className='input-label'>Project Image</Form.Label>
            
            <Form.File
                type='file'
                className='custom-file-label'
                custom
            />
        </div>
    )
}

export default FileUpload;