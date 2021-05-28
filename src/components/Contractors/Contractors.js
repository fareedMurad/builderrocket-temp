import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getContractors, getContractorTypes } from '../../actions/contractorActions';
import { Button, Form } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import './Contractors.scss';

// components
import MarketingBlock from '../MarketingBlock';
import AddContractor from '../AddContractor';

const Contractors = () => {
    const dispatch = useDispatch();

    const contractors = useSelector(state => state.contractor.contractors);
    const contractorTypes = useSelector(state => state.contractor.contractorTypes);

    const [showContractorModal, setShowContractorModal] = useState(false);

    useEffect(() => {
        dispatch(getContractors());
        dispatch(getContractorTypes());
    }, [dispatch]);

    const filterContractorsByType = (id) => {
        return contractors?.filter((contractor) => contractor.ContractorTypes.find((type) => type.ID === id));
    }

    return (
        <div className='d-flex contractors'>
            <div className='contractors-container'>
                <div className='d-flex'>
                    <div className='page-title'>Contractor</div>

                     <div className='ml-1 add-btn'>
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
                            <div key={index} className='select contractor'>
                                <Form.Label className='input-label'>
                                    {contractorType.Name && contractorType.Name}
                                </Form.Label>
                                <Form.Control as='select'>
                                    {!isEmpty(filterContractorsByType(contractorType.ID)) ? 
                                        filterContractorsByType(contractorType.ID)?.map((contractor, index) => (
                                            <option key={index} value={contractor.ID}>{contractor.CompanyName}</option>
                                        ))
                                    : 
                                        <option>SELECT</option>
                                    }
                                </Form.Control>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='d-flex justify-content-center  pt-5'>
                    <a href='/' className='cancel'>Cancel</a>
                    <button className='primary-gray-btn next-btn ml-3'>Next</button>
                </div>
            </div>

            <MarketingBlock />

            {showContractorModal &&
                <AddContractor 
                    show={showContractorModal}
                    handleClose={() => setShowContractorModal(false)}  
                />
            }
        </div>
    );
}

export default Contractors;