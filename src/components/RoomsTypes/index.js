import React, { useState, useEffect } from "react";
import "react-bootstrap-accordion/dist/index.css";
import { Accordion } from "react-bootstrap-accordion";
import { Table, Modal, Button, Form, Spinner } from "react-bootstrap";
import Select from "react-select";
import {
  assignGroupToRoom,
  createRoom,
  createRoomTypes,
  deleteRoom,
  deleteRoomType,
  getBuilderRoomGroupDetails,
  getBuilderRoomGroups,
  getBuilderRoomTypes,
  renameRoom,
  renameRoomType,
} from "../../actions/roomActions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
const RoomsTypes = () => {
  const roomTypes = useSelector(
    (state) => state.builderRooms.builderRoomTypes?.RoomTypes
  );
  const roomGroups = useSelector(
    (state) => state.builderRooms.builderRoomGroups?.Result
  );
  const [modalVisible, setModalVisible] = useState("");
  const [roomTypeName, setRoomTypeName] = useState("");
  const [roomTypeGroup, setRoomTypeGroup] = useState({});
  const [selectedRoomType, setSelectedRoomType] = useState({});
  const [selectedRoom, setSelectedRoom] = useState({});
  const [newRoom, setNewRoom] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    handleFetchRoomTypes();
    handleFetchRoomGroups();
  }, []);

  const handleFetchRoomGroups = () => {
    dispatch(getBuilderRoomGroups()).then((data) => {
      setIsLoading(false);
    });
  };

  const handleFetchRoomTypes = () => {
    if (!roomTypes?.length) setIsLoading(true);
    dispatch(getBuilderRoomTypes()).then((data) => {
      setIsLoading(false);
    });
  };

  const handleInputChange = (event) => {
    setRoomTypeName(event.target.value);
  };

  const handleAdd = () => {
    const params = {
      SourceName: roomTypeName,
    };
    dispatch(createRoomTypes(params))
      .then((res) => {
        handleFetchRoomTypes();
        setModalVisible("");
        setRoomTypeName("");
      })
      .catch(() => {
        alert("Something went wrong, please try again!");
      });
  };

  const handleAddNewRoom = () => {
    if (newRoom.name) {
      const params = {
        SourceName: newRoom.name,
        DestinationID: selectedRoomType?.ID,
      };
      dispatch(createRoom(params))
        .then((res) => {
          if (newRoom.group?.ID) {
            dispatch(assignGroupToRoom(res, parseInt(newRoom.group?.ID)));
          }
        })
        .then(() => {
          setModalVisible("");
          handleFetchRoomTypes();
        })
        .catch(() => {
          alert("Something went wrong, please try again!");
        });
      setNewRoom({});
    }
  };

  const handleEditRoom = () => {
    if (newRoom.name) {
      const params = {
        SourceID: selectedRoom?.ID,
        SourceName: newRoom.name,
        DefaultRoomGroupID: selectedRoom?.DefaultRoomGroup?.ID,
      };
      dispatch(renameRoom(params))
        .then((res) => {
          if (newRoom.group?.ID) {
            dispatch(assignGroupToRoom(selectedRoom?.ID, newRoom.group?.ID));
          }
        })
        .then(() => {
          setModalVisible("");
          handleFetchRoomTypes();
        })
        .catch(() => {
          alert("Something went wrong, please try again!");
        });
      setNewRoom({});
    }
  };

  const handleEditRoomType = () => {
    const params = {
      SourceID: selectedRoomType?.ID,
      SourceName: roomTypeName,
      DefaultRoomGroupID:
        roomTypeGroup?.value ?? selectedRoomType?.BuilderDefaultRoomGroupID,
    };

    dispatch(renameRoomType(params))
      .then((res) => {
        setModalVisible("");
        handleFetchRoomTypes();
        setRoomTypeName("");
      })
      .catch(() => {
        alert("Something went wrong, please try again!");
      });
  };

  const handleDeleteRoomType = () => {
    dispatch(deleteRoomType(selectedRoomType.ID))
      .then((res) => {
        setModalVisible("");
        handleFetchRoomTypes();
      })
      .catch(() => {
        alert("Something went wrong, please try again!");
      });
  };

  const handleDeleteRoom = () => {
    dispatch(deleteRoom(selectedRoom.ID))
      .then((res) => {
        setModalVisible("");
        handleFetchRoomTypes();
      })
      .catch(() => {
        alert("Something went wrong, please try again!");
      });
  };

  const handleGetBuilderRoomGroupDetails = (selectedGroupId) => {
    if (selectedGroupId) {
      dispatch(getBuilderRoomGroupDetails(selectedGroupId)).then((res) => {
        history.push(`/rooms-management/templates`);
      });
    }
  };

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
              onClick={isRoomType ? handleDeleteRoomType : handleDeleteRoom}
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
            {isAdd ? "Add New" : "Save"} Room Type
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
          {!isAdd ? (
            <Form.Group>
              <Form.Label className="input-label">Select Template</Form.Label>
              <Select
                options={roomGroups
                  ?.sort((a, b) => a.Name?.localeCompare(b.Name))
                  ?.map((c) => {
                    return { ...c, label: c.Name, value: c.ID };
                  })}
                className="input-gray"
                value={roomTypeGroup}
                onChange={(option) => setRoomTypeGroup(option)}
              />
            </Form.Group>
          ) : null}
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
              onClick={isAdd ? handleAdd : handleEditRoomType}
            >
              {isAdd ? "Add" : "Save"}
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
            {isAdd ? "Add New" : "Save"} Room
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
            <Form.Label className="input-label">Select Template</Form.Label>
            <Select
              options={roomGroups
                ?.sort((a, b) => a.Name?.localeCompare(b.Name))
                ?.map((c) => {
                  return { ...c, label: c.Name, value: c.ID };
                })}
              className="input-gray"
              value={newRoom.group}
              onChange={(option) => setNewRoom({ ...newRoom, group: option })}
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
              onClick={isAdd ? handleAddNewRoom : handleEditRoom}
            >
              {isAdd ? "Add" : "Save"}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  const handleEditRoomTypeModal = (e, item) => {
    e.stopPropagation();
    setRoomTypeName(item.Name);
    setSelectedRoomType(item);
    setRoomTypeGroup(
      item?.DefaultRoomGroup
        ? {
            ...item?.DefaultRoomGroup,
            value: item?.DefaultRoomGroup?.ID,
            label: item?.DefaultRoomGroup?.Name,
          }
        : {}
    );

    setModalVisible("EDIT_ROOM_TYPE");
  };

  const handleEditRoomModal = (e, room) => {
    e.stopPropagation();
    setSelectedRoom(room);
    setNewRoom({
      name: room?.Name,
      group: room?.DefaultRoomGroup
        ? {
            ...room?.DefaultRoomGroup,
            value: room?.DefaultRoomGroup?.ID,
            label: room?.DefaultRoomGroup?.Name,
          }
        : {},
    });
    setModalVisible("EDIT_ROOM");
  };

  const handleAddRoom = (e, item) => {
    e.stopPropagation();
    setSelectedRoomType(item);
    setSelectedRoom({});
    setNewRoom({});
    setModalVisible("ADD_ROOM");
  };

  const handleAddRoomType = (e) => {
    e.stopPropagation();
    setSelectedRoomType({});
    setRoomTypeName({});
    setRoomTypeName("");
    setModalVisible("ADD_ROOM_TYPE");
  };

  const handleDeleteRoomTypeModal = (e) => {
    e.stopPropagation();
    setModalVisible("DELETE_ROOM_TYPE");
  };

  const handleDeleteRoomModal = (e, room) => {
    e.stopPropagation();
    setSelectedRoom(room);
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

      {isLoading ? (
        <div className="pt-5 pb-5 w-full h-100 d-flex align-items-center justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        roomTypes
          ?.sort((a, b) => a.Name?.localeCompare(b.Name))
          ?.map((item, index) => (
            <Accordion
              title={
                <div className="d-flex justify-content-between w-100 pr-5">
                  <div className="d-flex align-selecItem-center">
                    <div className="font-weight-bold mr-5">
                      {item.Name}{" "}
                      {item.DefaultRoomGroup ? (
                        <small>[{item.DefaultRoomGroup?.Name}]</small>
                      ) : null}
                    </div>
                    <i
                      className="far fa-pen fa-sm tab-icon p-2"
                      onClick={(e) => handleEditRoomTypeModal(e, item)}
                    ></i>
                    <i
                      className="far fa-plus fa-sm tab-icon p-2"
                      onClick={(e) => handleAddRoom(e, item)}
                    ></i>
                    <i
                      className="far fa-trash fa-sm tab-icon p-2"
                      onClick={(e) => handleDeleteRoomTypeModal(e)}
                    ></i>
                  </div>
                  <span className="px-2">
                    {item.Rooms?.length}{" "}
                    {item.Rooms?.length > 0 ? "room" : "rooms"}
                  </span>{" "}
                </div>
              }
              children={
                <div>
                  {" "}
                  <Table>
                    <tbody>
                      {item.Rooms?.length ? (
                        item.Rooms?.sort((a, b) =>
                          a.Name?.localeCompare(b.Name)
                        )?.map((room, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                {room.BuilderDefaultRoomGroupID ? (
                                  <a
                                    href="#"
                                    onClick={() =>
                                      handleGetBuilderRoomGroupDetails(
                                        room.BuilderDefaultRoomGroupID
                                      )
                                    }
                                  >
                                    {room.Name}
                                  </a>
                                ) : (
                                  room.Name
                                )}
                              </td>
                              <td>
                                {room.DefaultRoomGroup?.Name
                                  ? `[ ${room.DefaultRoomGroup?.Name} ]`
                                  : ""}
                              </td>
                              <td>
                                <div className="d-flex">
                                  <i
                                    className="far fa-pen fa-sm tab-icon px-2"
                                    onClick={(e) =>
                                      handleEditRoomModal(e, room)
                                    }
                                  ></i>
                                  <i
                                    className="far fa-trash fa-sm tab-icon px-2"
                                    onClick={(e) =>
                                      handleDeleteRoomModal(e, room)
                                    }
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
          ))
      )}
      {deleteRoomTypeModal()}
      {editAddRoomTypeModal()}
      {editAddRoomModal()}
    </div>
  );
};

export default RoomsTypes;
