import React from 'react';
import { Button } from 'react-bootstrap';
import './Drawings.scss';

// components
import MarketingBlock from '../MarketingBlock';

const Drawings = () => {

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
                    <div className='d-flex justify-content-between drawing'>
                        <div>Floor Plan Drawing Main Floor</div>
                        <div className='icon-container'><i className='far fa-pencil-alt'></i></div>
                        <div className='icon-container'><i className='fa fa-share-square'></i></div>
                        <div className='icon-container'>
                            <i className='far fa-trash-alt'></i>
                        </div>
                    </div>
                </div>

            </div>

            <MarketingBlock />
        </div>
    );
}

export default Drawings;