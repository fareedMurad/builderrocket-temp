import React from 'react';
import './FileUpload.scss';


const FileUpload = (props) => {

    return (
        <div className='file-upload'>
            <input type='file' hidden className='input-gray' />
            <button className='primary-gray-btn button'>Browse</button>
        </div>
    )
}

export default FileUpload;