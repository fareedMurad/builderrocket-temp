import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRoomTypes } from '../../actions/roomActions';
import './RoomAreaLayout.scss';

// components
import MarketingBlock from '../MarketingBlock';

const RoomAreaLayout = (props) => {
    const dispatch = useDispatch();

    const roomTypes = useSelector(state => state.room.roomTypes);

    useEffect(() => {
        dispatch(getRoomTypes());
    }, [dispatch]);

    console.log('ROOMS', roomTypes);

    return (
        <div className='d-flex room-area-layout'>
            <div className='container'>
                <div>
                    <div className='page-title'>Room/Area Layout</div>
                    <div className='subtext'>A default list of rooms has been provided. You can add or remove rooms for this project.</div>

                </div>

                <div className='rooms'>
        
                </div>
            </div>
    
            <MarketingBlock />
        </div>
    );
}

export default RoomAreaLayout;