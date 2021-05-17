import React, { useState } from 'react';
import { Form, Col, Button } from 'react-bootstrap';
import './Utilities.scss';

// components
import MarketingBlock from '../MarketingBlock';
import AddUtility from '../AddUtility';
import Select from '../Select';

const Utilities = () => {

    const [showUtilityModal, setShowUtilityModal] = useState(false);

    return (
        <div className='d-flex utilities'>
            <div className='utilities-container'>
                <div className='d-flex'>
                    <div className='page-title'>Utilities</div>

                    <div className='ml-1 add-btn'>
                        <Button 
                            variant='link' 
                            className='link-btn'
                            onClick={() => setShowUtilityModal(true)}    
                        >
                            + Add Utility
                        </Button>
                    </div>   
                </div>


                <div className='d-flex utilities-form'>
                    <Col>
                        <div className='pb-2'>
                            <Select label='Utility Locate' />
                        </div>
                        <div className='pb-2'>
                            <Select label='Water Company' />
                        </div>
                        <div className='pb-2'>
                            <Select label='Sewer' />
                        </div>
                    </Col>

                    <Col>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>Locate Permit #</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                            />
                        </div>
                        <div className='pb-2'>
                            <Select label='Power Company' />
                        </div>
                        <div className='pb-2'>
                            <Select label='Gas Company' />
                        </div>
                    </Col>
                </div>

                <div className='d-flex justify-content-center pt-5'>
                    <a href='/' className='cancel'>Cancel</a>
                    <button className='primary-gray-btn next-btn ml-3'>Next</button>
                </div>
            </div>

            <MarketingBlock />

            {showUtilityModal && 
                <AddUtility 
                    show={showUtilityModal} 
                    handleClose={() => setShowUtilityModal(false)} 
                />
            }
        </div>
    );
}

export default Utilities;