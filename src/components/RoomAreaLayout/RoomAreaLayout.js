import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRoomTypes } from '../../actions/roomActions';
import { addRoomsToProject, deleteRoomsFromProject } from '../../actions/projectActions';
import { Form, Spinner } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import './RoomAreaLayout.scss';

// components
import MarketingBlock from '../MarketingBlock';

const RoomAreaLayout = (props) => {
    const dispatch = useDispatch();

    const roomTypes = useSelector(state => state.room.roomTypes);
    const project = useSelector(state => state.project.project);

    const [roomList, setRoomList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [deleteRoomList, setDeleteRoomList] = useState([]);

    useEffect(() => {
        dispatch(getRoomTypes());
    }, [dispatch]);

    const isRoomInProject = (id) => {
        return project?.ProjectRooms?.find((room) => room?.RoomID === id);
    }

    const handleCheckBox = (roomID, e) => {

        if (isRoomInProject(roomID)) {
    
            if (deleteRoomList?.includes(roomID)) {
                let tempDeleteRoomList = deleteRoomList;
                const deleteRoomIndex = tempDeleteRoomList.indexOf(roomID);

                if (deleteRoomIndex > -1) {
                    tempDeleteRoomList.splice(deleteRoomIndex, 1);
                }

                setDeleteRoomList(tempDeleteRoomList);
            } else {
                setDeleteRoomList([ ...deleteRoomList, roomID ]);
            }
        } else {

            if (roomList.includes(roomID)) {
                let tempRoomList = roomList;
                const roomIndex = tempRoomList.indexOf(roomID);

                if (roomIndex > -1) {
                    tempRoomList.splice(roomIndex, 1);
                }

                setRoomList(tempRoomList);
            } else {
                setRoomList([ ...roomList, roomID]);
            }
        }
    }
    
    console.log('ROOMS', roomList);
    console.log('DELETE ROOM', deleteRoomList);

    const handleAddRoomsToProject = () => {
        setIsLoading(true);

        if (!isEmpty(roomList)) {
            const roomsObj = {
                RoomIDs: roomList
            }

            dispatch(addRoomsToProject(project?.ID, roomsObj))
                .then(() => {
                    setRoomList([]);
                    setIsLoading(false);
                });
        }
    }

    const handleRemoveProjectRooms = () => {
        setIsLoading(true);

        if (!isEmpty(deleteRoomList)) {
            const deleteRoomsObj = {
                IDs: deleteRoomList
            }

            dispatch(deleteRoomsFromProject(project?.ID, deleteRoomsObj))
                .then(() => {
                    setDeleteRoomList([]);
                    setIsLoading(false);
                })
        }
    }

    const save = () => {
        handleAddRoomsToProject();
        handleRemoveProjectRooms();
    }

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

                {isLoading ? 
                        <div className='d-flex justify-content-center pt-5'>
                            <Spinner 
                                animation='border'
                                variant='primary' 
                            />
                        </div>
                :
                    <div className='d-flex justify-content-center pt-5'>
                        <a href='/' className='cancel'>Cancel</a>
                        <button 
                            className='primary-gray-btn next-btn ml-3'
                            onClick={save}
                        >
                            Next
                        </button>
                    </div>
                }
            </div>
    
            <MarketingBlock />
        </div>
    );
}

export default RoomAreaLayout;