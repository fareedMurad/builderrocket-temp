import React from 'react';
import { Button } from 'react-bootstrap';
import './Drawings.scss';

// components
import MarketingBlock from '../MarketingBlock';

const Drawings = (props) => {
    const { project } = props;

    console.log('project', project);

    return (
        <div className='d-flex drawings'>
            <div className='drawings-container'>
                <div className='d-flex'>
                    <div className='page-title'>Drawings</div>

                    <div className='ml-1 add-btn'>
                        <Button 
                            variant='link' 
                            className='link-btn'
                            // onClick={() => setShowContractorModal(true)}
                        >
                            + Add Drawings
                        </Button>
                    </div> 
                </div>

                <div className='drawings-form'>
                    {project?.Images?.map((image, index) => (
                        <div key={index} className='d-flex drawing'>
                            <div className='file-image'>       
                                <img 
                                    alt='drawing' 
                                    height='45' 
                                    width='50' 
                                    src={image?.URL}
                                />
                            </div>
                            <div className='file-name'>{image?.FileName}</div>
                            {/* <div className='d-flex icons'> */}
                                <div className='icon'><i className='far fa-pencil-alt'></i></div>
                                <div className='icon'><i className='fa fa-share-square'></i></div>
                                <div className='icon'>
                                    <i className='far fa-trash-alt'></i>
                                </div>
                            {/* </div> */}
                        </div>
                    ))}
                </div>

            </div>

            <MarketingBlock />
        </div>
    );
}

export default Drawings;