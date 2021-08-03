import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUtilities, getUtilityTypes } from '../../actions/utilityActions';
import { saveProject, setSelectedProjectTab } from '../../actions/projectActions';
import { Button, Form, Spinner } from 'react-bootstrap';
import './Utilities.scss';

// components
import ClearChangesModal from '../ClearChangesModal';
import MarketingBlock from '../MarketingBlock';
import AddUtility from '../AddUtility';

const Utilities = () => {
    const dispatch = useDispatch();

    const project = useSelector(state => state.project.project);
    const utilities = useSelector(state => state.utility.utilities);
    const utilityTypes = useSelector(state => state.utility.utilityTypes);
    
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [utilitiesInfo, setUtilitiesInfo] = useState(project);
    const [showUtilityModal, setShowUtilityModal] = useState(false);

    useEffect(() => {
        dispatch(getUtilityTypes());
        dispatch(getUtilities());
    }, [dispatch]);

    const filterUtilitiesByType = (id) => {
        return utilities?.filter((utility) => utility.UtilityTypeID === id);
    }

    const clearChanges = () => {
        setUtilitiesInfo(project);

        setShowModal(false);
    }

    const saveChanges = () => { 
        setIsLoading(true);

        // Save Project then navigate to contractors tab
        dispatch(saveProject(utilitiesInfo))
            .then(() => {
                setIsLoading(false);
                dispatch(setSelectedProjectTab('contractors'));
            });
    }
    
    return (
        <div className='d-flex utilities'>
            <div className='utilities-container'>
                <div className='d-flex'>
                    <div className='page-title'>Utilities</div>

                    <div className='ml-1'>
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
                            <div 
                                key={index} 
                                className='select utility'
                            >
                                <Form.Label className='input-label'>
                                    {utilityType.Name && utilityType.Name}
                                </Form.Label>
                                
                                <Form.Control as='select'>
                                    <option>SELECT</option>
                                    {filterUtilitiesByType(utilityType.ID)?.map((utility, index) => (
                                        <option 
                                            key={index} 
                                            value={utility.ID}
                                        >
                                            {utility.CompanyName}
                                        </option>
                                    ))}
                                </Form.Control>
                            </div>
                        ))}
                        <div className='utility'>
                            <Form.Label className='input-label'>Locate Permit #</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                value={utilitiesInfo?.LocatePermitNumber ? utilitiesInfo?.LocatePermitNumber : ''}
                                onChange={(event) => setUtilitiesInfo({ 
                                    ...utilitiesInfo,
                                    LocatePermitNumber: event.target.value
                                })}
                            />
                        </div>  
                    </div>
                </div>

                <div className='d-flex justify-content-center pt-5'>
                    {isLoading ? (
                        <Spinner 
                           animation='border'
                           variant='primary' 
                       />
                    ) : (
                        <>
                            <Button 
                                variant='link' 
                                className='cancel'
                                onClick={() => setShowModal(true)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className='primary-gray-btn next-btn ml-3'
                                onClick={saveChanges}
                            >
                                Next
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <MarketingBlock />

            <ClearChangesModal 
                show={showModal} 
                setShow={setShowModal} 
                clearChanges={clearChanges}
            />

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