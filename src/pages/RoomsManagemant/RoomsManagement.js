import React, { useEffect, useState } from 'react';
import './RoomsManagement.scss';
import RoomsTabs from '../../components/RoomsTabs/RoomsTabs';

const RoomsManagement = () => {
    return (
        <div className=' room-management'>
            <div className='page-title'>Rooms Management</div>
            <RoomsTabs/>
        </div>
    );
}

export default RoomsManagement;