import React, { useState, useEffect } from "react";
import "react-bootstrap-accordion/dist/index.css";
import { Accordion } from "react-bootstrap-accordion";
import { Table, Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";
import {
  createRoom,
  createRoomTypes,
  getBuilderRoomTypes,
} from "../../actions/roomActions";
import { useDispatch } from "react-redux";
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
  const [modalVisible, setModalVisible] = useState("");
  const [roomTypeName, setRoomTypeName] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState({});
  const [newRoom, setNewRoom] = useState({});
  const [selecedItem, setSelectedItem] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBuilderRoomTypes()).then((data) => {
      setRoomTypes(data.RoomTypes);
    });
  }, []);

  const handleInputChange = (event) => {
    setRoomTypeName(event.target.value);
  };

  const handleAdd = () => {
    const params = {
      SourceName: roomTypeName,
    };
    dispatch((params))
      .then((res) => {
        console.log(res, "res");
        setModalVisible("");
      })
      .catch(() => {
        alert("Something went wrong creating contractor");
      });
    setRoomTypeName("");
  };

  const handleAddNewRoom = () => {
    const params = {
      SourceName: newRoom.name,
      DestinationID: selectedRoomType?.ID,
    };

    dispatch(createRoom(params))
      .then((res) => {
        console.log(res, "res");
        setModalVisible("");
      })
      .catch(() => {
        alert("Something went wrong creating contractor");
      });
    setRoomTypeName("");
  };

  const handleDeleteRoomType = () =>{
    alert('hello')

  }

  const deleteRoomTypeModal = () => {
    const isRoomType = modalVisible === "DELETE_ROOM_TYPE";
    return (
      <Modal
        show={isRoomType || modalVisible === "DELETE_ROOM"}
        onHide={() => setModalVisible("")}
        centered
        size="md"
      >
        <Modal.Body>
          <div className="page-title pl-0">
            Delete Room {isRoomType ? "Type" : ""}
          </div>
          <div className="d-flex">
            Are you sure you want to delete this Room {isRoomType ? "Type" : ""}
            ?
          </div>
          <div className="d-flex justify-content-center pt-5">
            <Button
              onClick={() => setModalVisible("")}
              variant="link"
              className="cancel"
            >
              Cancel
            </Button>
            <button
              className="primary-gray-btn next-btn ml-3"
            onClick={handleDeleteRoomType}
            >
              Delete
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  const editAddRoomTypeModal = () => {
    const isAdd = modalVisible === "ADD_ROOM_TYPE";
    return (
      <Modal
        show={modalVisible === "EDIT_ROOM_TYPE" || isAdd}
        onHide={() => setModalVisible("")}
        centered
        size="md"
      >
        <Modal.Body>
          <div className="page-title pl-0">
            {isAdd ? "Add New" : "Edit"} Room Type
          </div>
          <Form.Group>
            <Form.Label className="input-label">Room Type Name*</Form.Label>
            <Form.Control
              type="text"
              className="input-gray"
              value={roomTypeName}
              onChange={handleInputChange}
            />
          </Form.Group>
          <div className="d-flex justify-content-center pt-5">
            <Button
              onClick={() => setModalVisible("")}
              variant="link"
              className="cancel"
            >
              Cancel
            </Button>
            <button
              className="primary-gray-btn next-btn ml-3"
              onClick={handleAdd}
            >
              {isAdd ? "Add" : "Edit"}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  const editAddRoomModal = () => {
    const isAdd = modalVisible === "ADD_ROOM";
    return (
      <Modal
        show={modalVisible === "EDIT_ROOM" || isAdd}
        onHide={() => setModalVisible("")}
        centered
        size="md"
      >
        <Modal.Body>
          <div className="page-title pl-0">
            {isAdd ? "Add New" : "Edit"} Room
          </div>
          <Form.Group>
            <Form.Label className="input-label">Room Name*</Form.Label>
            <Form.Control
              type="text"
              className="input-gray"
              value={newRoom.name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="input-label">Select Room Group</Form.Label>
            <Select
              options={[]}
              className="input-gray"
            // value={newRoom.group}
            // onChange={option => setNewRoom({...newRoom, group: option})}
            // value={contractor.ContractorTypes}
            // onChange={(options) => setContractor({ ...contractor, ContractorTypes: options })}
            />
          </Form.Group>
          <div className="d-flex justify-content-center pt-5">
            <Button
              onClick={() => setModalVisible("")}
              variant="link"
              className="cancel"
            >
              Cancel
            </Button>
            <button
              className="primary-gray-btn next-btn ml-3"
              onClick={isAdd ? handleAddNewRoom : undefined}
            >
              {isAdd ? "Add" : "Edit"}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  const handleEditRoomType = (e) => {
    e.stopPropagation();
    setModalVisible("EDIT_ROOM_TYPE");
  };

  const handleEditRoom = (e) => {
    e.stopPropagation();
    setModalVisible("EDIT_ROOM");
  };

  const handleAddRoom = (e, item) => {
    e.stopPropagation();
    setSelectedRoomType(item);
    setModalVisible("ADD_ROOM");
  };

  const handleAddRoomType = (e) => {
    e.stopPropagation();
    setModalVisible("ADD_ROOM_TYPE");
  };

  const handleDeleteGroup = (e) => {
    e.stopPropagation();
    setModalVisible("DELETE_ROOM_TYPE");
  };

  const handleDeleteRoom = (e,item) => {
    e.stopPropagation();
    setSelectedItem(item)
    setModalVisible("DELETE_ROOM");
  };

  return (
    <div className="room-management-container">
      <Button
        variant="link"
        className="link-btn"
        onClick={(e) => handleAddRoomType(e)}
      >
        + Add Room Type
      </Button>
      {roomTypes?.map((item, index) => (
        <Accordion
          title={
            <div className="d-flex justify-content-between w-100 pr-5">
              <div className="d-flex align-selecItem-center">
                <div className="font-weight-bold mr-5">{item.Name}</div>
                <i
                  className="far fa-pen fa-sm tab-icon p-2"
                  onClick={(e) => handleEditRoomType(e)}
                ></i>
                <i
                  className="far fa-plus fa-sm tab-icon p-2"
                  onClick={(e) => handleAddRoom(e, item)}
                ></i>
                <i
                  className="far fa-trash fa-sm tab-icon p-2"
                  onClick={(e) => handleDeleteGroup(e)}
                ></i>
              </div>
              <span className="px-2">{item.Rooms?.length} rooms</span>{" "}
            </div>
          }
          children={
            <div>
              {" "}
              <Table>
                <tbody>
                  {item.Rooms?.length ? (
                    item.Rooms?.map((room, index) => {
                      return (
                        <tr key={index}>
                          <td>{room.Name}</td>
                          <td>{room.DefaultRoomGroup?.Name}</td>
                          <td>
                            <div className="d-flex">
                              <i
                                className="far fa-pen fa-sm tab-icon px-2"
                                onClick={(e) => handleEditRoom(e)}
                              ></i>
                              <i
                                className="far fa-trash fa-sm tab-icon px-2"
                                onClick={(e) => handleDeleteRoom(e,room)}
                              ></i>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <td>No rooms added</td>
                  )}
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
