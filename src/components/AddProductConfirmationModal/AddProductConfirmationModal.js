import React, { useEffect, useState } from "react";
import { Col, Form, Modal, Button, Row, Spinner } from "react-bootstrap";
import "./AddProductConfirmationModal.scss";
import { useSelector } from "react-redux";
import { Accordion } from "react-bootstrap-accordion";
import queryString from 'query-string';

const AddProductConfirmationModal = ({
  show,
  handleClose,
  handleAdd,
  isShowRooms,
  loader,
}) => {
  const [form, setForm] = useState({
    RequiresApproval: true,
    RoughInTrimOutEnum: "RoughIn",
  });
  const project = useSelector((state) => state.project.project);
  const room = useSelector((state) => state.room);
  const roomTypes = room?.roomTypes;
  const [selectedRoomIDs, setSelectedRoomIDs] = useState([]);
  const searchParams = queryString.parse(window?.location?.search);

  useEffect(() => {
    if(searchParams.roomId) {
      setSelectedRoomIDs([Number(searchParams.roomId)])
    }
  },[])

  useEffect(() => {
    setForm({ ...form, roomIDs: selectedRoomIDs });
  }, [selectedRoomIDs]);

  const handleSave = () => {
    handleAdd?.(form);
  };

  const isRoomInProject = (id) => {
    return selectedRoomIDs?.find((RoomID) => RoomID === id);
  };

  const handleCheckBox = (ID) => {
    if (selectedRoomIDs.includes(ID))
      setSelectedRoomIDs((prev) => prev.filter((prevID) => prevID !== ID));
    else setSelectedRoomIDs((prevs) => [...prevs, ID]);
  };

  const projectRoomTypes = () => {
    let array = [];

    const filtered = mergeDuplicatesAsArray(
      project.BuilderProjectRooms,
      "RoomTypeID"
    );

    array = filtered?.map((roomType, index) => {
      const isFound = roomTypes?.find((r) => r.ID === roomType.ID);
      if (isFound) {
        return {
          ...isFound,
          ...roomType,
        };
      } else return roomType;
    });

    return array;
  };

  return (
    <Modal
      centered
      size={isShowRooms ? "lg" : "md"}
      show={show}
      onHide={handleClose}
      className="conform-modal"
    >
      <Modal.Body>
        <Row>
          <Col md={12}>
            <Form.Label className="input-label">
              This product requires approval?
            </Form.Label>
            <Form className="d-flex justify-content-start align-itmes-center form_cheacker">
              <Form.Check
                type="radio"
                checked={form.RequiresApproval}
                onChange={(event) =>
                  setForm({ ...form, RequiresApproval: event.target.checked })
                }
                label="Yes"
                name="RequiresApproval"
              />
              <Form.Check
                type="radio"
                checked={!form.RequiresApproval}
                onChange={(event) =>
                  setForm({ ...form, RequiresApproval: !event.target.checked })
                }
                label="No"
                name="RequiresApproval"
              />
            </Form>
          </Col>
          <Col md={12}>
            <Form.Label className="input-label">RoughIn/TrimOut</Form.Label>
            <Form className="d-flex justify-content-start align-itmes-center form_cheacker">
              <Form.Check
                type="radio"
                checked={form.RoughInTrimOutEnum === "RoughIn"}
                onChange={(event) =>
                  setForm({ ...form, RoughInTrimOutEnum: "RoughIn" })
                }
                label="RoughIn"
                name="RoughInTrimOutEnum"
              />
              <Form.Check
                type="radio"
                checked={form.RoughInTrimOutEnum === "TrimOut"}
                onChange={(event) =>
                  setForm({ ...form, RoughInTrimOutEnum: "TrimOut" })
                }
                label="TrimOut"
                name="RoughInTrimOutEnum"
              />
            </Form>
          </Col>
          {isShowRooms ? (
            <Col md={12} className="mt-4">
              <Accordion
                title={
                  <div className="d-flex justify-content-between w-100 pr-3">
                    <h6>
                      The product becomes added only to the selected rooms.
                    </h6>
                    <span className="px-2 text-secondary">
                      currently selected <b>{selectedRoomIDs?.length}</b> room
                      {selectedRoomIDs?.length > 1 ? "s" : ""}
                    </span>{" "}
                  </div>
                }
                children={
                  <div className="d-flex flex-wrap">
                    {projectRoomTypes()?.map((roomType, index) => (
                      <div key={index} className="room-type-container">
                        <div className="room-type">{roomType?.Name}</div>
                        {roomType?.Rooms?.map((room, index) => (
                          <div key={index} className="room-name">
                            <Form.Check
                              type="checkbox"
                              defaultChecked={isRoomInProject(room?.ID)}
                              onChange={() => handleCheckBox(room?.ID)}
                              label={`${room?.Name}`}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                }
              />
            </Col>
          ) : null}
        </Row>

        <div className="d-flex justify-content-end pt-1">
          <>
            <Button variant="link" className="cancel" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="primary-gray-btn next-btn ml-3"
              disabled={!selectedRoomIDs?.length}
            >
              {loader ? (
                <Spinner animation="border" variant="primary" size="sm" />
              ) : (
                "Add"
              )}
            </Button>
          </>
        </div>
      </Modal.Body>
    </Modal>
  );
};

function mergeDuplicatesAsArray(array, key) {
  const map = new Map();

  for (const obj of array) {
    const keyValue = obj[key];

    if (map.has(keyValue)) {
      const existingObj = map.get(keyValue);
      existingObj.Rooms.push({
        ID: obj.ID,
        Name: obj.RoomName,
      }); // Add object to the existing array
    } else {
      map.set(keyValue, {
        ID: keyValue,
        Rooms: [{ ID: obj.ID, Name: obj.RoomName }],
      });
    }
  }

  return Array.from(map.values());
}

export default AddProductConfirmationModal;
