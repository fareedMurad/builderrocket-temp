import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Form, Spinner } from "react-bootstrap";
import Select from "react-select";
import {
  assignGroupToRoom,
  createRoom,
  createRoomTypes,
  deleteRoom,
  deleteRoomType,
  getBuilderRoomGroups,
  getBuilderRoomTypes,
  renameRoom,
} from "../../actions/roomActions";
import { useDispatch } from "react-redux";

const RoomsTypes = () => {
  const [modalVisible, setModalVisible] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomGroups, setRoomGroups] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState({});
  const [selectedRoom, setSelectedRoom] = useState({});
  const [newRoom, setNewRoom] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  useEffect(() => {
    handleFetchRoomTypes();
    handleFetchRoomGroups();
  }, []);

  const handleFetchRoomGroups = () => {
    dispatch(getBuilderRoomGroups()).then((data) => {
      setRoomGroups(data.Result);
      setIsLoading(false);
    });
  };

  const handleFetchRoomTypes = () => {
    dispatch(getBuilderRoomTypes()).then((data) => {
      setRoomTypes(data.RoomTypes);
      setIsLoading(false);
    });
  };

  const handleAddNewRoom = () => {
    if (newRoom.name) {
      function handleCreateRoom(ID) {
        const params = {
          SourceName: newRoom.name,
          DestinationID: ID,
        };
        dispatch(createRoom(params))
          .then((res) => {
            dispatch(assignGroupToRoom(res, parseInt(newRoom.group?.ID)));
          })
          .then(() => {
            setModalVisible("");
            handleFetchRoomTypes();
            setNewRoom({});
          })
          .catch(() => {
            alert("Something went wrong, please try again!!");
          });
      }

      const isFound = roomTypes.find((rt) => rt.Name === newRoom.group?.Name);
      if (isFound) {
        handleCreateRoom(isFound.ID);
        return;
      }
      const params = {
        SourceName: newRoom.group?.Name,
      };
      dispatch(createRoomTypes(params))
        .then((res) => {
          handleCreateRoom(res.ID);
        })
        .catch(() => {
          alert("Something went wrong, please try again!");
        });
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
        .then(async (res) => {
          if (newRoom.group?.ID) {
            handleDeleteRoom();
            handleAddNewRoom();
            setModalVisible("");
            handleFetchRoomTypes();
          }
        })
        .then(() => {
          if (!newRoom?.group?.ID) {
            setModalVisible("");
            handleFetchRoomTypes();
          }
        })
        .catch(() => {
          alert("Something went wrong, please try again!");
        });
      setNewRoom({});
    }
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
            {isAdd ? "Create" : "Edit"} Room
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
            <Form.Label className="input-label">Select Room Type*</Form.Label>
            <Select
              options={roomGroups?.map((c) => {
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
              disabled={!newRoom.group?.ID}
            >
              {isAdd ? "Add" : "Save"}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  const handleEditRoomModal = (e, item, room) => {
    e.stopPropagation();
    setSelectedRoom(room);
    setSelectedRoomType(item);
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
    // setSelectedRoomType(item);
    setModalVisible("ADD_ROOM");
  };

  const handleDeleteRoomModal = (e, item, room) => {
    e.stopPropagation();
    setSelectedRoomType(item);
    setSelectedRoom(room);
    setModalVisible("DELETE_ROOM");
  };

  return (
    <div className="room-management-container">
      <Button
        variant="link"
        className="link-btn"
        // onClick={(e) => handleAddRoomType(e)}
        onClick={(e) => handleAddRoom(e)}
      >
        + Create Room
      </Button>

      {isLoading ? (
        <div className="pt-5 pb-5 w-full h-100 d-flex align-items-center justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : roomTypes?.length ? (
        <div>
          <Table>
            <tbody>
              {roomTypes?.map((item, index) =>
                item.Rooms?.length
                  ? item.Rooms?.map((room, index) => {
                      return (
                        <tr key={index}>
                          <td>{room.Name}</td>
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
                                  handleEditRoomModal(e, item, room)
                                }
                              ></i>
                              <i
                                className="far fa-trash fa-sm tab-icon px-2"
                                onClick={(e) =>
                                  handleDeleteRoomModal(e, item, room)
                                }
                              ></i>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  : null
              )}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="py-5 text-center">No rooms added yet!</div>
      )}
      {deleteRoomTypeModal()}
      {editAddRoomModal()}
    </div>
  );
};

export default RoomsTypes;
