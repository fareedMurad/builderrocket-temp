import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getContractors, getContractorTypes } from '../../actions/contractorActions';
import { saveProject, setSelectedProjectTab } from '../../actions/projectActions';
import { Button, Form, Spinner } from 'react-bootstrap';
import './Contractors.scss';

// components
import ClearChangesModal from '../ClearChangesModal';
import MarketingBlock from '../MarketingBlock';
import AddContractor from '../AddContractor';

const Contractors = () => {
    const dispatch = useDispatch();

    const project = useSelector(state => state.project.project);
    const contractors = useSelector(state => state.contractor.contractors);
    const contractorTypes = useSelector(state => state.contractor.contractorTypes);

    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [contractorInfo, setContratorInfo] = useState(project);
    const [showContractorModal, setShowContractorModal] = useState(false);

    useEffect(() => {
        dispatch(getContractors());
        dispatch(getContractorTypes());
    }, [dispatch]);

    const filterContractorsByType = (id) => {
        // filter contractors that fit contractor type ID
        return contractors?.filter((contractor) => contractor.ContractorTypes.find((type) => type.ID === id));
    }

    const handleContractor = (id, contractorTypeID) => {
        if (!id || !contractorTypeID) return;

        const contractorID = parseInt(id);
        const contractorsMap = contractorInfo.Contractors;
        const selectedContractor = contractors.find(contractor => contractor.ID === contractorID);
        
        // update the selected contractor type with selected contractor
        contractorsMap[contractorTypeID] = { 
            ContractorID: contractorID, 
            ContractorTypeID: contractorTypeID, 
            CompanyName: selectedContractor.CompanyName,
            PhoneNumber: selectedContractor.PhoneNumber,
            EmailAddress: selectedContractor.EmailAddress
        };
        
        // update project component state with updated contractor map
        setContratorInfo({ ...contractorInfo, Contractors: contractorsMap });
    }

    const clearChanges = () => {
        setContratorInfo(project);

        setShowModal(false);
    }

    const saveChanges = () => {
        // Save changes and navigate to Drawings tab
        setIsLoading(true); 

        dispatch(saveProject(contractorInfo))
            .then(() => {
                setIsLoading(false);
                dispatch(setSelectedProjectTab('drawings'));
            });
    }

    return (
        <div className='d-flex contractors'>
            <div className='contractors-container'>
                <div className='d-flex'>
                    <div className='page-title'>Contractor</div>

                     <div className='ml-1'>
                        <Button 
                            variant='link' 
                            className='link-btn'
                            onClick={() => setShowContractorModal(true)}
                        >
                            + Add Contractor
                        </Button>
                    </div> 
                </div>
               
                <div className='contractors-form'>
                    <div className='d-flex flex-wrap'>

                        {contractorTypes?.map((contractorType, index) => (
                            <div 
                                key={index} 
                                className='select contractor'
                            >
                                <Form.Label className='input-label'>
                                    {contractorType.Name && contractorType.Name}
                                </Form.Label>

                                <Form.Control
                                    as='select'
                                    value={contractorInfo?.Contractors?.[contractorType?.ID]?.ContractorID}
                                    onChange={(event) => handleContractor(event.target.value, contractorType.ID)}
                                >
                                    <option value=''>SELECT</option>
                                    {filterContractorsByType(contractorType.ID)?.map((contractor, index) => (
                                        <option 
                                            key={index}
                                            value={contractor.ID}
                                        >
                                            {contractor.CompanyName}
                                        </option>
                                    ))}
                                </Form.Control>
                                    
                                {contractorInfo?.Contractors?.[contractorType?.ID]?.ContractorID && (
                                    <div className='pt-1 pl-1'>
                                        {contractorInfo?.Contractors?.[contractorType?.ID]?.PhoneNumber && (
                                            <div>
                                                <i className='fas fa-phone mr-2'></i> 
                                                <a href={`tel:+1${contractorInfo?.Contractors?.[contractorType?.ID]?.PhoneNumber}`}>
                                                    {contractorInfo?.Contractors?.[contractorType?.ID]?.PhoneNumber}
                                                </a>  
                                            </div>
                                        )}
                                        {contractorInfo?.Contractors?.[contractorType?.ID]?.EmailAddress && (
                                            <div>
                                                <i className='fas fa-envelope mr-2'></i> 
                                                <a href={`mailto:${contractorInfo?.Contractors?.[contractorType?.ID]?.EmailAddress}`}> 
                                                    {contractorInfo?.Contractors?.[contractorType?.ID]?.EmailAddress}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
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

            {showContractorModal && (
                <AddContractor 
                    show={showContractorModal}
                    handleClose={() => setShowContractorModal(false)}  
                />
            )}
        </div>
    );
}

export default Contractors;