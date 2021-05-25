import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUtilities, getUtilityTypes } from '../../actions/utilityActions';
import { Button, Form } from 'react-bootstrap';
import './Utilities.scss';

// components
import MarketingBlock from '../MarketingBlock';
import AddUtility from '../AddUtility';

const Utilities = () => {

    const dispatch = useDispatch();

    const utilityTypes = useSelector(state => state.utility.utilityTypes);
    const utilities = useSelector(state => state.utility.utilities);
    
    const [showUtilityModal, setShowUtilityModal] = useState(false);

    useEffect(() => {
        dispatch(getUtilityTypes());
        dispatch(getUtilities());
    }, [dispatch]);

    const filterUtilitiesByType = (id) => {
        return utilities?.filter((utility) => utility.utilityTypeID === id);
    }

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

                <div className='utilities-form'>
                    <div className='d-flex flex-wrap'>
                        {utilityTypes?.map((utilityType, index) => (
                            <div key={index} className='select utility'>
                                <Form.Label className='input-label'>
                                    {utilityType.name && utilityType.name}
                                </Form.Label>
                                <Form.Control as='select'>
                                    {filterUtilitiesByType(utilityType.id)?.map((utility, index) => (
                                        <option key={index}>{utility.companyName}</option>
                                    ))}
                                </Form.Control>
                            </div>
                        ))}
                        <div className='utility'>
                            <Form.Label className='input-label'>Locate Permit #</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                            />
                        </div>  
                    </div>
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