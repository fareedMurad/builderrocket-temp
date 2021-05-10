import React from 'react';
import { Link } from 'react-router-dom';
import './Drawings.scss';

// components
import MarketingBlock from '../MarketingBlock';

const Drawings = () => {

    return (
        <div className='d-flex drawings'>
            <div className='drawings-container'>
                <div className='d-flex tab-item-title'>
                    Drawings
                    <div className='ml-3'>
                        <Link to='/project' className='link-btn'>
                            + Add Drawings
                        </Link>
                    </div>
                </div>

            </div>

            <MarketingBlock />
        </div>
    );
}

export default Drawings;