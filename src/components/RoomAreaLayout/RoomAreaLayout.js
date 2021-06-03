import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getRoomTypes } from '../../actions/roomActions';
import { addRoomsToProject } from '../../actions/projectActions';
import { isEmpty } from 'lodash';
import './RoomAreaLayout.scss';

// components
import MarketingBlock from '../MarketingBlock';

const RoomAreaLayout = (props) => {
    const dispatch = useDispatch();

    const roomTypes = useSelector(state => state.room.roomTypes);
    const project = useSelector(state => state.project.project);

    const [roomList, setRoomList] = useState([]);

    useEffect(() => {
        dispatch(getRoomTypes());
    }, [dispatch]);

    const isRoomInProject = (id) => {
        return project?.ProjectRooms?.find((room) => room?.RoomID === id);
    }

    const handleCheckBox = (roomID, e) => {
        
        if (!roomList.includes(roomID)) {
            setRoomList([ ...roomList, roomID]);
        } else {
            let tempRoomList = roomList;
            const roomIndex = tempRoomList.indexOf(roomID);

            if (roomIndex > -1) {
                tempRoomList.splice(roomIndex, 1);
              }

            setRoomList(tempRoomList);
        }
    }

    const handleAddRoomsToProject = () => {
        if (!isEmpty(roomList)) {
            const roomsObj = {
                RoomIDs: roomList
            }

            dispatch(addRoomsToProject(project?.ID, roomsObj))
                .then(() => {
                    setRoomList([]);
                });
        }
    }

    console.log('ROOM Types', project);
    console.log('ROOM LIST', roomList);

    return (
        <div className='d-flex room-area-layout'>
            <div className='container'>
                <div>
                    <div className='page-title'>Room/Area Layout</div>
                    <div className='subtext'>A default list of rooms has been provided. You can add or remove rooms for this project.</div>

                </div>

                <div className='rooms d-flex flex-wrap justify-content-around'>
                    {roomTypes?.map((roomType, index) => (
                        <div key={index} className='room-type-container'>
                            <div className='room-type'>{roomType?.Name}</div>

                            {roomType?.Rooms?.map((room, index) => (
                                <div key={index} className='room-name'>
                                    <Form.Check 
                                        type='checkbox'
                                        defaultChecked={isRoomInProject(room?.ID)} 
                                        onChange={() => handleCheckBox(room?.ID)}
                                        label={`${room?.Name}`} 
                                    />
                                </div>
                            ))}
                        </div>

                    ))}
                </div>

                <div className='d-flex justify-content-center pt-5'>
                    <a href='/' className='cancel'>Cancel</a>
                    <button 
                        className='primary-gray-btn next-btn ml-3'
                        onClick={handleAddRoomsToProject}
                    >
                        Next
                    </button>
                </div>
            </div>
    
            <MarketingBlock />
        </div>
    );
}

export default RoomAreaLayout;