import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUtilities, getUtilityTypes } from '../../actions/utilityActions';
import { saveProject, setSelectedProjectTab, saveProjectUtility } from '../../actions/projectActions';
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
    const [showUtilityModal, setShowUtilityModal] = useState(false);
    const [utilitiesInfo, setUtilitiesInfo] = useState(project.Utilities);
    const [locatePermitNumber, setLocatePermitNumber] = useState(project.LocatePermitNumber);

     // Ref to access changes on unmount 
    const projectRef = useRef();
    const utilitiesRef = useRef();
    const locatePermitNumberRef = useRef();

    useEffect(() => {
        dispatch(getUtilityTypes());
        dispatch(getUtilities());
    }, [dispatch]);

    const filterUtilitiesByType = (id) => {
        // filter utilities by utility type
        return utilities?.filter((utility) => utility.UtilityTypeID === id);
    }

    const handleUtility = (id, utilityTypeID) => {
        if (!utilityTypeID) return;


        let utilityID;
        let newUtilitiesMap;
        let selectedUtility;




        if (id) {
            utilityID = parseInt(id);


        dispatch(saveProjectUtility(project.ID, utilityTypeID, utilityID))
            .then((data) => {
                console.log(data)
            })    

            selectedUtility = utilities.find(utility => utility.ID === utilityID);

            // update the selected utility TYPE with selected utility
            newUtilitiesMap = {
                ...utilitiesInfo, 
                [utilityTypeID]: {
                    UtilityID: utilityID,
                    UtilityTypeID: utilityTypeID,
                    CompanyName: selectedUtility?.CompanyName, 
                    PhoneNumber: selectedUtility?.PhoneNumber,
                    EmailAddress: selectedUtility?.EmailAddress
                }
            }
        } else {
            newUtilitiesMap = {
                ...utilitiesInfo,
                [utilityTypeID]: {
                    UtilityID: null,
                    UtilityTypeID: utilityTypeID
                }
            }
        }

        // update component state with updated utilities map
        setUtilitiesInfo({ ...newUtilitiesMap });
    }

    const clearChanges = () => {
        setUtilitiesInfo({ ...project.Utilities });
        setLocatePermitNumber(project.LocatePermitNumber);

        setShowModal(false);
    }

    const saveChanges = () => { 
        setIsLoading(true);

        // Save Project then navigate to contractors tab
        dispatch(saveProject({
            ...project,
            Utilities: utilitiesInfo,
            LocatePermitNumber: locatePermitNumber
        })).then(() => {
                setIsLoading(false);
                dispatch(setSelectedProjectTab('contractors'));
            });
    }

    useEffect(() => {
        // reference latest changes 
        projectRef.current = project;
        utilitiesRef.current = utilitiesInfo;
        locatePermitNumberRef.current = locatePermitNumber;
    }, [utilitiesInfo, locatePermitNumber, project]);

    useEffect(() => {
        return () => {
            // save any changes when navigating away
            dispatch(saveProject({
                ...projectRef.current, 
                Utilities: utilitiesRef.current,
                LocatePermitNumber: locatePermitNumberRef.current
            }))
        }
    }, [dispatch]);

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
                                
                                <Form.Control 
                                    as='select'
                                    value={utilitiesInfo?.[utilityType?.ID]?.UtilityID ? utilitiesInfo?.[utilityType?.ID]?.UtilityID : ''}
                                    onChange={(event) => handleUtility(event.target.value, utilityType.ID)}    
                                >
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

                                {utilitiesInfo?.[utilityType?.ID]?.UtilityID && (
                                    <div className='d-flex pt-1 pl-1'>
                                        {utilitiesInfo?.[utilityType?.ID]?.PhoneNumber && (
                                            <div className='pr-3'>
                                                <i className='fas fa-phone mr-2'></i> 
                                                <a href={`tel:+1${utilitiesInfo?.[utilityType?.ID]?.PhoneNumber}`}>
                                                    {utilitiesInfo?.[utilityType?.ID]?.PhoneNumber}
                                                </a>  
                                            </div>
                                        )}
                                        {utilitiesInfo?.[utilityType?.ID]?.EmailAddress && (
                                            <div>
                                                <i className='fas fa-envelope mr-2'></i> 
                                                <a href={`mailto:${utilitiesInfo?.[utilityType?.ID]?.EmailAddress}`}> 
                                                    {utilitiesInfo?.[utilityType?.ID]?.EmailAddress}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div className='utility'>
                            <Form.Label className='input-label'>Locate Permit #</Form.Label>
                            <Form.Control
                                type='text'
                                className='input-gray'
                                value={locatePermitNumber}
                                onChange={(event) => setLocatePermitNumber(event.target.value)}
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

            {showUtilityModal && (
                <AddUtility 
                    show={showUtilityModal} 
                    handleClose={() => setShowUtilityModal(false)} 
                />
            )}
        </div>
    );
}

export default Utilities;