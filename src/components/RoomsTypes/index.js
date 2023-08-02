import React, { useState } from "react";
import "react-bootstrap-accordion/dist/index.css";
import { Accordion } from "react-bootstrap-accordion";
import { Table, Modal, Button, Form } from "react-bootstrap";
import Select from 'react-select';

const RoomTypes = [
    {
        id: 1,
        roomTypename: "Room Type 1",
        noOfRooms: 10,
        rooms: [
            {
                id: 1,
                RoomName: "room1",
                group: "Group 1",
            },
            {
                id: 2,
                RoomName: "room2",
                group: "Group 2",
            },
        ],
    },
    {
        id: 2,
        roomTypename: "Room Type 2",
        noOfRooms: 8,
        rooms: [
            {
                id: 1,
                RoomName: "room1",
                group: "Group 1",
            },
            {
                id: 2,
                RoomName: "room2",
                group: "Group 2",
            },
        ],
    },
];

const RoomsTypes = () => {
    const [showDeleteModal, setShowDeleteModal] = useState("");

    const deleteRoomTypeModal = () => {
        const isRoomType = showDeleteModal === "DELETE_ROOM_TYPE";
        return (
            <Modal
                show={isRoomType || showDeleteModal === "DELETE_ROOM"}
                onHide={() => setShowDeleteModal("")}
                centered
                size='md'
            >
                <Modal.Body>
                    <div className='page-title pl-0'>Delete Room {isRoomType ? "Type":""}</div>
                    <div className='d-flex'>
                        Are you sure you want to delete this Room {isRoomType ? "Type":""}?
                    </div>
                    <div className='d-flex justify-content-center pt-5'>
                        <Button
                            onClick={() => setShowDeleteModal("")}
                            variant='link'
                            className='cancel'
                        >
                            Cancel
                        </Button>
                        <button
                            className='primary-gray-btn next-btn ml-3'
                        // onClick={handleDeleteUtility}
                        >
                            Delete
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }

    const editAddRoomTypeModal = () => {
        const isAdd = showDeleteModal === "ADD_ROOM_TYPE";
        return (
            <Modal
                show={showDeleteModal === "EDIT_ROOM_TYPE" || isAdd}
                onHide={() => setShowDeleteModal("")}
                centered
                size='md'
            >
                <Modal.Body>
                    <div className='page-title pl-0'>{isAdd ? "Add New" : "Edit"} Room Type</div>
                    <Form.Group>
                        <Form.Label className='input-label'>Room Type Name*</Form.Label>
                        <Form.Control
                            type='text'
                            className='input-gray'
                        />
                    </Form.Group>
                    <div className='d-flex justify-content-center pt-5'>
                        <Button
                            onClick={() => setShowDeleteModal("")}
                            variant='link'
                            className='cancel'
                        >
                            Cancel
                        </Button>
                        <button
                            className='primary-gray-btn next-btn ml-3'
                        // onClick={handleDeleteUtility}
                        >
                            {isAdd ? "Add" : "Edit"}
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }

    const editAddRoomModal = () => {
        const isAdd = showDeleteModal === "ADD_ROOM";
        return (
            <Modal
                show={showDeleteModal === "EDIT_ROOM" || isAdd}
                onHide={() => setShowDeleteModal("")}
                centered
                size='md'
            >
                <Modal.Body>
                    <div className='page-title pl-0'>{isAdd ? "Add New" : "Edit"} Room</div>
                    <Form.Group>
                        <Form.Label className='input-label'>Room Name*</Form.Label>
                        <Form.Control
                            type='text'
                            className='input-gray'
                        />
                    </Form.Group>
                    <Form.Group>
                            <Form.Label className='input-label'>Select Room Group</Form.Label>
                            <Select 
                                isMulti 
                                options={[]}
                                className='input-gray'
                                // value={contractor.ContractorTypes}
                                // onChange={(options) => setContractor({ ...contractor, ContractorTypes: options })}
                            />
                        </Form.Group>
                    <div className='d-flex justify-content-center pt-5'>
                        <Button
                            onClick={() => setShowDeleteModal("")}
                            variant='link'
                            className='cancel'
                        >
                            Cancel
                        </Button>
                        <button
                            className='primary-gray-btn next-btn ml-3'
                        // onClick={handleDeleteUtility}
                        >
                            {isAdd ? "Add" : "Edit"}
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }



    const handleEditRoomType = (e) => {
        e.stopPropagation();
        setShowDeleteModal("EDIT_ROOM_TYPE");
    }

    const handleEditRoom = (e) => {
        e.stopPropagation();
        setShowDeleteModal("EDIT_ROOM");
    }

    const handleAddRoom = (e) => {
        e.stopPropagation();
        setShowDeleteModal("ADD_ROOM");
    }

    const handleAddRoomType = (e) => {
        e.stopPropagation();
        setShowDeleteModal("ADD_ROOM_TYPE");
    }

    const handleDeleteGroup = (e) => {
        e.stopPropagation();
        setShowDeleteModal("DELETE_ROOM_TYPE");
    }


    const handleDeleteRoom = (e) => {
        e.stopPropagation();
        setShowDeleteModal("DELETE_ROOM");
    }

    return (
        <div className="room-management-container">
            <Button
                variant='link'
                className='link-btn'
                onClick={(e) => handleAddRoomType(e)}
            >
                + Add Room Type
            </Button>
            {RoomTypes?.map((item, index) => (
                <Accordion
                    title={
                        <div className="d-flex justify-content-between w-100 pr-5">
                            <div className="d-flex align-items-center">
                                <div className="font-weight-bold mr-5">{item.roomTypename}</div>
                                <i className="far fa-pen fa-sm tab-icon p-2" onClick={(e) => handleEditRoomType(e)}></i>
                                <i className="far fa-plus fa-sm tab-icon p-2" onClick={(e) => handleAddRoom(e)}></i>
                                <i className="far fa-trash fa-sm tab-icon p-2" onClick={(e) => handleDeleteGroup(e)}></i>
                            </div>
                            <span className="px-2">{item.noOfRooms} rooms</span>{" "}
                        </div>
                    }
                    children={
                        <div>
                            {" "}
                            <Table>
                                <tbody>
                                    {item.rooms?.map((templateItem, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{templateItem.RoomName}</td>
                                                <td>{templateItem.group}</td>
                                                <td>
                                                    <div className="d-flex">
                                                        <i className="far fa-pen fa-sm tab-icon px-2" onClick={(e) => handleEditRoom(e)}></i>
                                                        <i className="far fa-trash fa-sm tab-icon px-2" onClick={(e) => handleDeleteRoom(e)}></i>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    }
                />
            ))}
            {deleteRoomTypeModal()}
            {editAddRoomTypeModal()}
            {editAddRoomModal()}
        </div>
    );
};

export default RoomsTypes;
