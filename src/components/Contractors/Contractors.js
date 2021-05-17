import React from 'react';
import { Link } from 'react-router-dom';
import { Col } from 'react-bootstrap';
import './Contractors.scss';

// components
import MarketingBlock from '../MarketingBlock';
import Select from '../Select';

const Contractors = () => {
    return (
        <div className='d-flex contractors'>
            <div className='contractors-container'>
                <div className='d-flex page-title'>
                    Contractor  
                    <div className='ml-3'>
                        <Link to='/project' className='link-btn'>
                            + Add Contractor
                        </Link>
                    </div>
                </div>
               
                <div className='d-flex contractors-form'>
                    <Col>
                        <div className='pb-2'>
                            <Select label='Accesories/Filters/Refrigerator Water filters' />
                        </div>
                        <div className='pb-2'>
                            <Select label='Brick Veneer' />
                        </div>
                        <div className='pb-2'>
                            <Select label='Carpenter Farming' />
                        </div>
                        <div className='pb-2'>
                            <Select label='Central Vacuum System' />
                        </div>
                        <div className='pb-2'>
                            <Select label='Drywall' />
                        </div>
                        <div className='pb-2'>
                            <Select label='Grading' />
                        </div>
                        <div className='pb-2'>
                            <Select label='Labor - Cabinets' />
                        </div>
                        <div className='pb-2'>
                            <Select label='Labor - Trim' />
                        </div>
                        <div className='pb-2'>
                            <Select label='Plumbing' />
                        </div>
                        <div className='pb-2'>
                            <Select label='Septic System' />
                        </div>
                        <div className='pb-2'>
                            <Select label='Stone Veneer' />
                        </div>
                        <div className='pb-2'>
                            <Select label='Porta John Contractor' />
                        </div>
                    </Col>

                    <Col>
                        <div>
                            <Select label='Accesories/Portable Attachments/Stand' />
                        </div>
                        <div className='pb-2'>
                            <Select label='Cabinet Installer' />
                        </div>
                        <div className='pb-2'>
                            <Select label='Carpenter Trim' />
                        </div>
                        <div className='pb-2'>
                            <Select label='Concrete' />
                        </div>
                        <div className='pb-2'>
                            <Select label='Electrical' />
                        </div>
                        <div className='pb-2'>
                            <Select label='Gutters' />
                        </div>
                        <div className='pb-2'>
                            <Select label='Labor - Electrical' />
                        </div>
                        <div className='pb-2'>
                            <Select label='Landscaping' />
                        </div>
                        <div className='pb-2'>
                            <Select label='Roofer' />
                        </div>
                        <div className='pb-2'>
                            <Select label='Siding Veneer' />
                        </div>
                        <div className='pb-2'>
                            <Select label='Wood Siding' />
                        </div>
                    </Col>
                </div>

                <div className='d-flex justify-content-center  pt-5'>
                    <a href='/' className='cancel'>Cancel</a>
                    <button className='primary-gray-btn next-btn ml-3'>Next</button>
                </div>
            </div>

            <MarketingBlock />
        </div>
    );
}

export default Contractors;