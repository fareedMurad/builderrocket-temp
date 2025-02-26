import React, { useEffect, useState } from "react";
// import "react-bootstrap-accordion/dist/index.css";
// import { Accordion } from "react-bootstrap-accordion";
import {
  Table,
  Modal,
  Button,
  Form,
  Spinner,
  Accordion,
} from "react-bootstrap";
import Select from "react-select";
import {
  createRoomGroup,
  getBuilderRoomGroups,
  deleteRoomGroup,
  createRoomGroupCategory,
  createRoomGroupCategoryProduct,
  setSelectedBuilderRoomGroup,
  setSelectedBuilderCategory,
  deleteRoomGroupCategory,
  renameRoomGroup,
  setSelectedGroupCategoryProducts,
  renameRoomType,
  getBuilderRoomTypes,
  deleteRoomType,
  getBuilderRoomGroupDetails,
  getRoomGroupCategoryProduct,
  updateDefaultRoomProduct,
} from "../../actions/roomActions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import CustomLightbox from "../Lightbox";
import Avatar from "../../assets/images/img-placeholder.png";
import AddProductsByCategory from "../AddProductsByCategory";
let wsRegex = /\s/g;

const RoomGroups = () => {
  const roomTypes = useSelector(
    (state) => state.builderRooms.builderRoomTypes?.RoomTypes
  );
  const roomGroups = useSelector(
    (state) => state.builderRooms.builderRoomGroups?.Result
  );
  const selectedGroupCategories = useSelector(
    (state) => state.builderRooms.selectedGroupDetails?.selectedGroupCategories
  );
  const selectedGroupId = useSelector(
    (state) => state.builderRooms.selectedGroupDetails?.groupId
  );
  const [showVisibleModal, setShowVisibleModal] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedGroup, setSelectedGroup] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedProduct, setSelectedProduct] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [dublicateEditAttempted, setdublicateEditAttempted] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const [expandID, setExpandID] = useState();
  const [isGroupCategoriesLoading, setIsGroupCategoriesLoading] =
    useState(false);
  const [isDefaultProductLoading, setDefaultProductLoading] = useState({
    loading: false,
  });

  useEffect(() => {
    if (expandID) {
      handleGetBuilderRoomGroupDetails();
      const target = document.querySelector(`#selected_${expandID}`);
      setTimeout(() => {
        if (target) target.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [expandID]);

  useEffect(() => {
    if (selectedGroupId) {
      setExpandID(selectedGroupId);
      const target = document.querySelector(`#selected_${selectedGroupId}`);
      setTimeout(() => {
        if (target) target.scrollIntoView({ behavior: "smooth" });
        // dispatch(setSelectedBuilderCategory({})).then(() => {
        //   dispatch(setSelectedBuilderRoomGroup({})).then(() => {
        //
        //   });
        // });
      }, 1000);
    }
    handleFetchRoomGroups();
    handleFetchRoomTypes();
  }, []);

  const handleFetchRoomGroups = () => {
    if (!roomTypes?.length) setIsLoading(true);
    dispatch(getBuilderRoomGroups()).then((data) => {
      setIsLoading(false);
    });
  };

  const handleGetBuilderRoomGroupDetails = () => {
    if (!selectedGroupCategories?.length || expandID !== selectedGroupId)
      setIsGroupCategoriesLoading(true);
    dispatch(getBuilderRoomGroupDetails(expandID)).then((res) => {
      setTimeout(() => {
        setIsGroupCategoriesLoading(false);
      }, 200);
      setDefaultProductLoading({ loading: false });
    });
  };

  const handleFetchRoomTypes = () => {
    dispatch(getBuilderRoomTypes()).then((data) => {});
  };

  const handleGroupNameChange = (event) => {
    setGroupName(event.target.value);
  };

  const handleAddGroup = () => {
    dispatch(createRoomGroup(groupName))
      .then((res) => {
        handleFetchRoomGroups();
        setShowVisibleModal("");
        setGroupName("");
      })
      .catch(() => {
        alert("Something went wrong, please try again!");
      });
  };
  const handleDeleteRoomGroup = () => {
    dispatch(deleteRoomGroup(selectedGroup.ID))
      .then((res) => {
        const findRoomType = roomTypes.find(
          (rt) => rt.Name === selectedGroup?.Name
        );
        if (findRoomType) {
          dispatch(deleteRoomType(findRoomType.ID));
        }
        setShowVisibleModal("");
        handleFetchRoomGroups();
        setSelectedGroup({});
      })
      .catch(() => {
        alert("Something went wrong, please try again!");
        setSelectedGroup({});
      });
  };

  const handleDeleteRoomGroupCategory = () => {
    dispatch(
      deleteRoomGroupCategory(
        expandID,
        selectedCategory?.CategoryID,
        selectedProduct?.ID
      )
    )
      .then((res) => {
        if (selectedCategory.ProductCounts === 1)
          dispatch(
            createRoomGroupCategory(selectedCategory?.CategoryID, expandID)
          ).then(() => {
            setShowVisibleModal("");
            handleGetBuilderRoomGroupDetails();
          });
        else {
          setShowVisibleModal("");
          handleGetBuilderRoomGroupDetails();
        }
      })
      .catch(() => {
        alert("Something went wrong, please try again!");
      });
  };
  const handleEditGroup = () => {
    if (groupName) {
      if (
        roomGroups?.find(
          (rg) =>
            rg.Name.replaceAll(wsRegex, "") ===
            groupName.replaceAll(wsRegex, "")
        )
      ) {
        setdublicateEditAttempted(true);
        return;
      }
      dispatch(renameRoomGroup(selectedGroup?.ID, groupName))
        .then(() => {
          const findRoomType = roomTypes.find(
            (rt) => rt.Name === selectedGroup?.Name
          );
          if (findRoomType) {
            const params = {
              SourceID: findRoomType?.ID,
              SourceName: groupName,
              DefaultRoomGroupID: findRoomType?.BuilderDefaultRoomGroupID,
            };
            dispatch(renameRoomType(params));
          }

          handleFetchRoomGroups();
          setShowVisibleModal("");
          setSelectedGroup({});
          setGroupName("");
          setdublicateEditAttempted(false);
        })
        .catch(() => {
          alert("Something went wrong, please try again!");
        });
    }
  };

  const deleteGroupModal = () => {
    const isGroup = showVisibleModal === "DELETE_GROUP";
    const isProduct = showVisibleModal === "DELETE_GROUP_CATEGORY_PRODUCT";
    return (
      <Modal
        show={
          isGroup ||
          showVisibleModal === "DELETE_GROUP_CATEGORY" ||
          showVisibleModal === "DELETE_GROUP_CATEGORY_PRODUCT"
        }
        onHide={() => setShowVisibleModal("")}
        centered
        size="md"
      >
        <Modal.Body>
          <div className="page-title pl-0">
            Delete {isGroup ? "Template" : isProduct ? "Product" : "Category"}
          </div>
          <div className="d-flex">
            Are you sure you want to delete this{" "}
            {isGroup ? "Template" : isProduct ? "Product" : "Category"}?
          </div>
          <div iv className="d-flex justify-content-center pt-5">
            <Button
              onClick={() => setShowVisibleModal("")}
              variant="link"
              className="cancel"
            >
              Cancel
            </Button>
            <button
              className="primary-gray-btn next-btn ml-3"
              onClick={
                isGroup ? handleDeleteRoomGroup : handleDeleteRoomGroupCategory
              }
            >
              Delete
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  const editAddGroupModal = () => {
    const isAdd = showVisibleModal === "ADD_GROUP";
    const isDublicate = isAdd
      ? roomGroups?.find(
          (rg) =>
            rg.Name.replaceAll(wsRegex, "") ===
            groupName.replaceAll(wsRegex, "")
        )
      : roomGroups?.find(
          (rg) =>
            rg.Name.replaceAll(wsRegex, "") ===
            groupName.replaceAll(wsRegex, "")
        ) && dublicateEditAttempted;
    return (
      <Modal
        show={showVisibleModal === "EDIT_GROUP" || isAdd}
        onHide={() => setShowVisibleModal("")}
        centered
        size="md"
      >
        <Modal.Body>
          <div className="page-title pl-0">
            {isAdd ? "Create" : "Edit"} Template
          </div>
          <Form.Group>
            <Form.Label className="input-label">Template Name*</Form.Label>
            <Form.Control
              type="text"
              className="input-gray"
              value={groupName}
              onChange={handleGroupNameChange}
            />
            <small className="text-danger h-5">
              {isDublicate && "Name already exist."}
            </small>
          </Form.Group>
          <div className="d-flex justify-content-center pt-5">
            <Button
              onClick={() => setShowVisibleModal("")}
              variant="link"
              className="cancel"
            >
              Cancel
            </Button>
            <button
              className="primary-gray-btn next-btn ml-3"
              onClick={isAdd ? handleAddGroup : handleEditGroup}
              disabled={isDublicate}
            >
              {isAdd ? "Add" : "Save"}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  const addGroupCategoryModal = () => {
    return (
      <Modal
        show={showVisibleModal === "ADD_GROUP_CATEGORY"}
        onHide={() => {
          setShowVisibleModal("");
          handleGetBuilderRoomGroupDetails();
          dispatch(setSelectedBuilderCategory({})).then(() => {
            dispatch(setSelectedBuilderRoomGroup({})).then(() => {});
          });
        }}
        centered
        size="xl"
        className="c-tree-wrapper"
      >
        <Modal.Body>
          <span>
            You are currently in <b>{selectedGroup?.Name}</b>
          </span>
          <hr />
          <i
            className="tree-modal-close-icon fa fa-times"
            onClick={() => {
              setShowVisibleModal("");
              handleGetBuilderRoomGroupDetails();
              dispatch(setSelectedBuilderCategory({})).then(() => {
                dispatch(setSelectedBuilderRoomGroup({})).then(() => {});
              });
            }}
          />
          <AddProductsByCategory current={selectedGroup} isTemplate={true} />
        </Modal.Body>
      </Modal>
    );
  };

  const handleEdit = (e, item) => {
    e.stopPropagation();
    setSelectedGroup(item);
    setGroupName(item.Name);
    setShowVisibleModal("EDIT_GROUP");
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    setGroupName("");
    setSelectedGroup({});
    setShowVisibleModal("ADD_GROUP");
  };

  const handleAddCategory = (e, item) => {
    dispatch(setSelectedBuilderRoomGroup(item));
    e?.stopPropagation();
    setSelectedGroup(item);
    setExpandID(item.ID);
    setShowVisibleModal("ADD_GROUP_CATEGORY");
  };

  const handleDeleteGroup = (e, item) => {
    e.stopPropagation();
    setSelectedGroup(item);
    setShowVisibleModal("DELETE_GROUP");
  };

  const handleDeleteGroupCategory = (e, item) => {
    e.stopPropagation();
    setSelectedCategory(item);
    setShowVisibleModal("DELETE_GROUP_CATEGORY");
  };

  const handleDeleteGroupCategoryProduct = (e, product, item) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setSelectedCategory(item);
    setShowVisibleModal("DELETE_GROUP_CATEGORY_PRODUCT");
  };

  const handleManageProducts = async (group, category) => {
    dispatch(setSelectedBuilderCategory(category)).then(() => {
      dispatch(setSelectedBuilderRoomGroup(group)).then(() => {
        // history.push(`/rooms-management/template-details`);
        handleAddCategory(null, group);
      });
    });
  };

  const itemLoading = (product, field) => {
    return (
      isDefaultProductLoading?.loading &&
      isDefaultProductLoading?.ID === product?.ID &&
      isDefaultProductLoading.field === field
    );
  };

  const handleRequiresApproval = (group, category, product, field, value) => {
    setDefaultProductLoading({ loading: true, ID: product?.ID, field });
    dispatch(
      updateDefaultRoomProduct(
        group.ID,
        category.CategoryID,
        product?.ID,
        value,
        field
      )
    ).then(async () => {
      await handleGetBuilderRoomGroupDetails();
    });
  };

  return (
    <div className="room-management-container">
      <Button variant="link" className="link-btn" onClick={(e) => handleAdd(e)}>
        + Add Template
      </Button>
      {isLoading ? (
        <div className="pt-5 pb-5 w-full h-100 d-flex align-items-center justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Accordion flush activeKey={expandID} onSelect={setExpandID}>
          {roomGroups
            ?.sort((a, b) => a.Name?.localeCompare(b.Name))
            .map((item, index) => (
              <Accordion.Item eventKey={item.ID}>
                <Accordion.Header>
                  <div className="d-flex justify-content-between w-100 pr-5">
                    <div className="d-flex align-items-center">
                      <div
                        className="font-weight-bold mr-5"
                        id={`selected_${item.ID}`}
                      >
                        {item.Name}
                      </div>
                      <i
                        className="far fa-pen fa-sm tab-icon p-2"
                        onClick={(e) => handleEdit(e, item)}
                      ></i>
                      <i
                        className="far fa-plus fa-sm tab-icon p-2"
                        onClick={(e) => handleAddCategory(e, item)}
                      ></i>
                      <i
                        className="far fa-trash fa-sm tab-icon p-2"
                        onClick={(e) => handleDeleteGroup(e, item)}
                      ></i>
                    </div>
                    <span className="px-2">
                      {item.Count} product
                      {item.Count > 1 ? "s" : ""}
                    </span>
                  </div>
                </Accordion.Header>
                {(selectedGroupCategories?.length ||
                  isGroupCategoriesLoading) &&
                expandID === item.ID ? (
                  <Accordion.Body>
                    <div className="internal-accordion">
                      {isGroupCategoriesLoading ? (
                        <div
                          className="pt-5 pb-5 w-full h-100 d-flex align-items-center justify-content-center"
                          style={{ minHeight: "200px" }}
                        >
                          <Spinner animation="border" variant="primary" />
                        </div>
                      ) : (
                        <Accordion
                          defaultActiveKey={selectedGroupCategories?.map(
                            (g) => g.ID
                          )}
                          alwaysOpen
                        >
                          {selectedGroupCategories
                            ?.sort((a, b) =>
                              a.CategoryLabel?.localeCompare(b.CategoryLabel)
                            )
                            ?.map((templateItem, index) => {
                              return (
                                <Accordion.Item eventKey={templateItem.ID}>
                                  <Accordion.Header
                                    className={"custom-accordian-button"}
                                  >
                                    <div className="d-flex justify-content-between w-100 pr-5">
                                      <div className="d-flex font-weight-bold">
                                        {templateItem?.CategoryLabel}
                                        <i
                                          className="far fa-trash fa-sm tab-icon ml-5"
                                          onClick={(e) =>
                                            handleDeleteGroupCategory(
                                              e,
                                              templateItem
                                            )
                                          }
                                        ></i>
                                      </div>
                                      <div className="d-flex justify-content-end align-items-center">
                                        <small className="mr-5 text-secondary">
                                          {templateItem.ProductCounts}{" "}
                                          {templateItem.ProductCounts > 1
                                            ? "Products"
                                            : "Product"}{" "}
                                          Added
                                        </small>
                                        <Button
                                          size="sm"
                                          onClick={() =>
                                            handleManageProducts(
                                              item,
                                              {
                                                Name: templateItem.CategoryLabel,
                                                ID: templateItem.CategoryID,
                                              },
                                              item.products
                                            )
                                          }
                                        >
                                          Manage Products
                                        </Button>
                                      </div>
                                    </div>
                                  </Accordion.Header>
                                  {templateItem.Products?.length ? (
                                    <Accordion.Body>
                                      <Table>
                                        <tbody>
                                          {templateItem.Products?.sort((a, b) =>
                                            a.ProductName?.localeCompare(
                                              b.ProductName
                                            )
                                          ).map((product, index) => (
                                            <tr key={index}>
                                              <td
                                                style={{
                                                  verticalAlign: "middle",
                                                }}
                                              >
                                                <CustomLightbox
                                                  images={[
                                                    product?.ThumbnailURL
                                                      ? product?.ThumbnailURL
                                                      : Avatar,
                                                  ]}
                                                />
                                              </td>
                                              <td
                                                style={{
                                                  verticalAlign: "middle",
                                                }}
                                              >
                                                <div className="d-flex">
                                                  {product?.ProductName}{" "}
                                                  <i
                                                    className="far fa-trash fa-sm tab-icon ml-2"
                                                    onClick={(e) =>
                                                      handleDeleteGroupCategoryProduct(
                                                        e,
                                                        product,
                                                        templateItem
                                                      )
                                                    }
                                                  ></i>
                                                </div>
                                                <span
                                                  style={{ fontSize: "12px" }}
                                                  className="text-secondary"
                                                >
                                                  {product.ProductDescription ||
                                                    product.ShortDescription}
                                                </span>
                                              </td>
                                              <td className="defaultproduct-actions">
                                                <div className="d-flex align-items-center justify-content-end">
                                                  <div>
                                                    <small
                                                      className="d-block mb-1"
                                                      style={{
                                                        whiteSpace: "nowrap",
                                                      }}
                                                    >
                                                      Requires Approval
                                                    </small>
                                                    {itemLoading(
                                                      product,
                                                      "RequiresApproval"
                                                    ) ? (
                                                      <Spinner
                                                        animation="border"
                                                        variant="primary"
                                                      />
                                                    ) : (
                                                      <Form.Check
                                                        type="checkbox"
                                                        checked={
                                                          product?.RequiresApproval
                                                        }
                                                        onChange={() =>
                                                          handleRequiresApproval(
                                                            item,
                                                            templateItem,
                                                            product,
                                                            "RequiresApproval",
                                                            !product?.RequiresApproval
                                                          )
                                                        }
                                                      />
                                                    )}
                                                  </div>
                                                  <div className="d-flex flex-column ml-3">
                                                    <small
                                                      className="d-block mb-1"
                                                      style={{
                                                        whiteSpace: "nowrap",
                                                      }}
                                                    >
                                                      RoughIn/TrimOut
                                                    </small>
                                                    {itemLoading(
                                                      product,
                                                      "RoughInTrimOut"
                                                    ) ? (
                                                      <Spinner
                                                        animation="border"
                                                        variant="primary"
                                                      />
                                                    ) : (
                                                      <Form
                                                        className="d-flex align-items-center"
                                                        style={{ gap: "10px" }}
                                                      >
                                                        <Form.Check
                                                          type="radio"
                                                          checked={
                                                            product.RoughInTrimOut ===
                                                            "RoughIn"
                                                          }
                                                          // disabled={
                                                          //   templateItem?.IsTemplate
                                                          // }
                                                          onChange={() =>
                                                            handleRequiresApproval(
                                                              item,
                                                              templateItem,
                                                              product,
                                                              "RoughInTrimOut",
                                                              "RoughIn"
                                                            )
                                                          }
                                                        />
                                                        <Form.Check
                                                          type="radio"
                                                          checked={
                                                            product.RoughInTrimOut ===
                                                            "TrimOut"
                                                          }
                                                          onChange={() =>
                                                            handleRequiresApproval(
                                                              item,
                                                              templateItem,
                                                              product,
                                                              "RoughInTrimOut",
                                                              "TrimOut"
                                                            )
                                                          }
                                                        />
                                                      </Form>
                                                    )}
                                                  </div>
                                                  <div className="qty-input ml-3">
                                                    <small className="d-block mb-1">
                                                      Quantity
                                                    </small>
                                                    {itemLoading(
                                                      product,
                                                      "Quantity"
                                                    ) ? (
                                                      <Spinner
                                                        animation="border"
                                                        variant="primary"
                                                      />
                                                    ) : (
                                                      <Form.Control
                                                        min="0"
                                                        type="text"
                                                        id={`quantity-${product?.ID}`}
                                                        // disabled={!product?.Quantity}
                                                        defaultValue={
                                                          product?.Quantity
                                                        }
                                                        onBlur={(e) =>
                                                          handleRequiresApproval(
                                                            item,
                                                            templateItem,
                                                            product,
                                                            "Quantity",
                                                            Number(
                                                              e.target.value
                                                            )
                                                          )
                                                        }
                                                      ></Form.Control>
                                                    )}
                                                  </div>
                                                </div>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </Table>
                                    </Accordion.Body>
                                  ) : null}
                                </Accordion.Item>
                              );
                            })}
                        </Accordion>
                      )}
                    </div>
                  </Accordion.Body>
                ) : null}
              </Accordion.Item>
            ))}
        </Accordion>
      )}

      {deleteGroupModal()}
      {editAddGroupModal()}
      {addGroupCategoryModal()}
    </div>
  );
};

export default RoomGroups;
