import React, { useEffect, useState } from "react";
import "react-bootstrap-accordion/dist/index.css";
import { Accordion } from "react-bootstrap-accordion";
import { Table, Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";
import {
  createRoomGroup,
  getBuilderRoomGroups,
  deleteRoomGroup,
} from "../../actions/roomActions";
import { useDispatch } from "react-redux";

const RoomGroups = () => {
  const [showDeleteModal, setShowDeleteModal] = useState("");
  const [groupName, setGroupName] = useState("");
  const [roomGroups, setRoomGroups] = useState([]);
  const [selecedGroup, setSelecedGroup] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
   handleFetchRoomGroups();
  }, []);

  const handleFetchRoomGroups = () => {
    dispatch(getBuilderRoomGroups()).then((data) => {
      setRoomGroups(data.Result);
    });
  }

  const handleGroupNameChange = (event) => {
    setGroupName(event.target.value);
  };

  const handleAddGroup = () => {
    dispatch(createRoomGroup(groupName))
      .then((res) => {
        setShowDeleteModal("");
      })
      .catch(() => {
        alert("Something went wrong creating contractor");
      });
    setGroupName("");
  };
  //
  const handleDeleteRoomGroup = () => {
    dispatch(deleteRoomGroup(selecedGroup.ID))
      .then((res) => {
        setShowDeleteModal("");
        handleFetchRoomGroups();
      })
      .catch(() => {
        alert("Something went wrong creating contractor");
      });
  };

  const deleteGroupModal = () => {
    const isGroup = showDeleteModal === "DELETE_GROUP";
    return (
      <Modal
        show={isGroup || showDeleteModal === "DELETE_GROUP_CATEGORY"}
        onHide={() => setShowDeleteModal("")}
        centered
        size="md"
      >
        <Modal.Body>
          <div className="page-title pl-0">
            Delete {isGroup ? "Group" : "Group Category"}
          </div>
          <div className="d-flex">
            Are you sure you want to delete this Room{" "}
            {isGroup ? "Group" : "Group Category"}?
          </div>
          <div iv className="d-flex justify-content-center pt-5">
            <Button
              onClick={() => setShowDeleteModal("")}
              variant="link"
              className="cancel"
            >
              Cancel
            </Button>
            <button
              className="primary-gray-btn next-btn ml-3"
              onClick={handleDeleteRoomGroup}
            >
              Delete
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  const editAddGroupModal = () => {
    const isAdd = showDeleteModal === "ADD_GROUP";
    return (
      <Modal
        show={showDeleteModal === "EDIT_GROUP" || isAdd}
        onHide={() => setShowDeleteModal("")}
        centered
        size="md"
      >
        <Modal.Body>
          <div className="page-title pl-0">
            {isAdd ? "Add New" : "Edit"} Group
          </div>
          <Form.Group>
            <Form.Label className="input-label">Group Name*</Form.Label>
            <Form.Control
              type="text"
              className="input-gray"
              value={groupName}
              onChange={handleGroupNameChange}
            />
          </Form.Group>
          <div className="d-flex justify-content-center pt-5">
            <Button
              onClick={() => setShowDeleteModal("")}
              variant="link"
              className="cancel"
            >
              Cancel
            </Button>
            <button
              className="primary-gray-btn next-btn ml-3"
              onClick={handleAddGroup}
            >
              {isAdd ? "Add" : "Edit"}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  const addGroupCategoryModal = () => {
    return (
      <Modal
        show={showDeleteModal === "ADD_GROUP_CATEGORY"}
        onHide={() => setShowDeleteModal("")}
        centered
        size="md"
      >
        <Modal.Body>
          <div className="page-title pl-0">Add New Category</div>
          <Form.Group>
            <Form.Label className="input-label">Select Category</Form.Label>
            <Select
              isMulti
              options={[]}
              className="input-gray"
              // value={contractor.ContractorTypes}
              // onChange={(options) => setContractor({ ...contractor, ContractorTypes: options })}
            />
          </Form.Group>
          <div className="d-flex justify-content-center pt-5">
            <Button
              onClick={() => setShowDeleteModal("")}
              variant="link"
              className="cancel"
            >
              Cancel
            </Button>
            <button
              className="primary-gray-btn next-btn ml-3"
              onClick={handleAddGroup}
            >
              Add
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowDeleteModal("EDIT_GROUP");
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    setShowDeleteModal("ADD_GROUP");
  };

  const handleAddCategory = (e) => {
    e.stopPropagation();
    setShowDeleteModal("ADD_GROUP_CATEGORY");
  };

  const handleDeleteGroup = (e,item) => {
    e.stopPropagation();
    setShowDeleteModal("DELETE_GROUP");
    setSelecedGroup(item)
  };

  const handleDeleteGroupCategory = (e) => {
    e.stopPropagation();
    setShowDeleteModal("DELETE_GROUP_CATEGORY");
  };

  return (
    <div className="room-management-container">
      <Button variant="link" className="link-btn" onClick={(e) => handleAdd(e)}>
        + Add Room Group
      </Button>
      {roomGroups?.map((item, index) => (
        <Accordion
          title={
            <div className="d-flex justify-content-between w-100 pr-5">
              <div className="d-flex align-items-center">
                <div className="font-weight-bold mr-5">{item.Name}</div>
                <i
                  className="far fa-pen fa-sm tab-icon p-2"
                  onClick={(e) => handleEdit(e)}
                ></i>
                <i
                  className="far fa-plus fa-sm tab-icon p-2"
                  onClick={(e) => handleAddCategory(e)}
                ></i>
                <i
                  className="far fa-trash fa-sm tab-icon p-2"
                  onClick={(e) => handleDeleteGroup(e,item)}
                ></i>
              </div>
              <span className="px-2">{item.categorys?.length} categories</span>{" "}
            </div>
          }
          children={
            <div>
              {" "}
              <Table>
                <tbody>
                  {item.categorys?.map((templateItem, index) => {
                    return (
                      <tr key={index}>
                        <td>{templateItem.name}</td>
                        <td>
                          <div>
                            <i
                              className="far fa-trash fa-sm tab-icon px-2"
                              onClick={(e) => handleDeleteGroupCategory(e)}
                            ></i>
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

      {deleteGroupModal()}
      {editAddGroupModal()}
      {addGroupCategoryModal()}
    </div>
  );
};

export default RoomGroups;
