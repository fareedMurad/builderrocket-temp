import React, {useEffect, useState, useRef, useCallback} from 'react';
import { getRoomTypes } from '../../actions/roomActions';
import { Form, Spinner, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { 
    addRoomsToProject, 
    setSelectedProjectTab, 
    deleteRoomsFromProject, 
} from '../../actions/projectActions';
import { isEmpty } from 'lodash';
import './RoomAreaLayout.scss';

// components
import MarketingBlock from '../MarketingBlock';
import ClearChangesModal from '../ClearChangesModal';
import Multiselect from "multiselect-react-dropdown";

const RoomAreaLayout = () => {
    const dispatch = useDispatch();

    const project = useSelector(state => state.project.project);
    const roomTypes = useSelector(state => state.room.roomTypes);

    const [roomList, setRoomList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [deleteRoomList, setDeleteRoomList] = useState([]);
    const [isLoadingRoomTypes, setIsLoadingRoomTypes] = useState(false);
    const [roomTypeOptions, setRoomTypeOptions] = useState([]);
    const [typesFilter, setTypesFilter] = useState([]);

    // Ref to access changes on unmount 
    const roomsRef = useRef();
    const deleteRoomsRef = useRef();
    const projectIDRef = useRef();

    useEffect(() => {
        setIsLoadingRoomTypes(true);

        dispatch(getRoomTypes())
            .then(() => {
                setIsLoadingRoomTypes(false);
            });
    }, [dispatch]);

    const isRoomInProject = (id) => {
        return project?.ProjectRooms?.find((room) => room?.RoomID === id);
    }

    const handleSelectedRoomTypeChange = useCallback((selectedTypes) => {
        const types = [...selectedTypes.map(b => b.ID)];
        setTypesFilter(types);
    }, [dispatch, setTypesFilter]);

    const handleCheckBox = (roomID, e) => {

        if (isRoomInProject(roomID)) {
            const selectedRoomID = isRoomInProject(roomID)?.ID;

            if (deleteRoomList?.includes(selectedRoomID)) {
                let tempDeleteRoomList = deleteRoomList;
                const deleteRoomIndex = tempDeleteRoomList.indexOf(selectedRoomID);

                if (deleteRoomIndex > -1) {
                    tempDeleteRoomList.splice(deleteRoomIndex, 1);
                }

                setDeleteRoomList(tempDeleteRoomList);
            } else {
                setDeleteRoomList([ ...deleteRoomList, selectedRoomID ]);
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

    const handleAddRoomsToProject = () => {
        if (!isEmpty(roomList)) {

            const roomsObj = {
                RoomIDs: roomList
            }

            dispatch(addRoomsToProject(project?.ID, roomsObj))
                .then(() => {
                    setRoomList([]);
                    return;
                })
                .catch(() => {
                    setIsLoading(false);
                    alert('Something went wrong adding rooms to project.');
                })
        }
    }

    const handleRemoveProjectRooms = () => {
        if (!isEmpty(deleteRoomList)) {

            const deleteRoomsObj = {
                IDs: deleteRoomList
            }

            dispatch(deleteRoomsFromProject(project?.ID, deleteRoomsObj))
                .then(() => {
                    setDeleteRoomList([]);
                    return;
                })
                .catch(() => {
                    setIsLoading(false);
                    alert('Something went wrong deleting rooms from project.');
                })
        }
    }

    const save = async () => {
        setIsLoading(true);

        await handleAddRoomsToProject();
        await handleRemoveProjectRooms();

        setIsLoading(false);

        dispatch(setSelectedProjectTab('products'));
    }

    const clearChanges = () => {
        setIsLoadingRoomTypes(true);
        setShowModal(false);

        setTimeout(() => {
            setRoomList([]);
            setDeleteRoomList([]);
            setIsLoadingRoomTypes(false);
        }, 250);
    }

    useEffect(() => {
        // reference latest changes
        roomsRef.current = roomList;
        projectIDRef.current = project?.ID;
        deleteRoomsRef.current = deleteRoomList;
    }, [roomList, deleteRoomList, project]);

    useEffect(() => {
        return () => {
            // save any changes when navigating away
            dispatch(addRoomsToProject(
                projectIDRef.current,
                { RoomIDs: roomsRef.current }
            ));
        }
    }, [dispatch]);

    useEffect(() => {
        return () => {
            // save any changes when navigating away
            dispatch(deleteRoomsFromProject(
                projectIDRef.current,
                { IDs: deleteRoomsRef.current }
            ));
        }
    }, [dispatch]);

    useEffect(() => {
        let options = [{
            name: "Select All",
            value: "select_all"
        }, ...roomTypes?.map((b) => {
            return {
                ...b,
                name: b.Name,
                value: b.ID,
            };
        })];
        if(roomTypes?.length > 0){
            setTypesFilter(roomTypes.map(r => r.ID));
        }
        setRoomTypeOptions(options);

    }, [project]);

    return (
        <div className='d-flex room-area-layout'>
            <div className='container'>
                <div className='d-flex flex-wrap'>
                    <div className='flex-grow-1'>
                        <div className='page-title'>Room/Area Layout</div>
                        <div className='subtext'>A default list of rooms has been provided. You can add or remove rooms for this project.</div>
                    </div>
                    <div>
                        <div className='input-label mt-2 ml-3'>Room Types</div>
                        <div className="layout-select custom-dropdown">
                                <span>
                                {typesFilter?.length > 0 ? <span className="custom-placeholder">
                                    {roomTypes?.filter(p => typesFilter.indexOf(p.ID) > -1)?.length} of {roomTypes?.length} selected
                                </span> : null}
                                </span>
                            <Multiselect
                                options={
                                    roomTypes?.length > 0 ? roomTypeOptions : []}
                                selectedValues={!typesFilter ? [] : (
                                    roomTypes?.length === typesFilter?.length ? roomTypeOptions : roomTypeOptions.filter(b => typesFilter.indexOf(b.ID) > -1)
                                )}
                                onSelect={(arr, current) => {
                                    if (current.value === 'select_all') {
                                        handleSelectedRoomTypeChange(roomTypeOptions.filter(p => p.value !== 'select_all'))
                                    } else
                                        handleSelectedRoomTypeChange(arr.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
                                }}
                                onRemove={(arr, target) => {
                                    let types = arr.filter(p => p.value !== 'select_all').sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
                                    if (target.value === 'select_all') {
                                        types = [];
                                    }
                                    handleSelectedRoomTypeChange(types)
                                }}
                                displayValue="name"
                                placeholder="Room Types Filter"
                                showCheckbox={true}
                                keepSearchTerm={false}
                                hidePlaceholder={true}
                            />
                        </div>
                    </div>
                </div>


                {isLoadingRoomTypes ? (
                    <div className='room-area-layout-spinner d-flex justify-content-center'>
                        <Spinner 
                            animation='border'
                            variant='primary' 
                        />
                    </div>
                ) : (
                    <div className='rooms d-flex flex-wrap justify-content-around'>
                        {roomTypes?.filter(r => typesFilter?.indexOf(r.ID) > -1).map((roomType, index) => (
                            <div 
                                key={index} 
                                className='room-type-container'
                            >
                                <div className='room-type'>{roomType?.Name}</div>

                                {roomType?.Rooms?.map((room, index) => (
                                    <div 
                                        key={index} 
                                        className='room-name'
                                    >
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
                )}

                <ClearChangesModal 
                    show={showModal}
                    setShow={setShowModal}
                    clearChanges={clearChanges}
                />

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
                                onClick={save}
                                className='primary-gray-btn next-btn ml-3'
                            >
                                Next
                            </Button>
                        </>
                    )}
                </div>
            </div>
    
            <MarketingBlock />
        </div>
    );
}

export default RoomAreaLayout;
