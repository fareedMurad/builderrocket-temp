import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Form,
  Modal,
  OverlayTrigger,
  Spinner,
  Table,
  Tooltip,
  Card,
} from "react-bootstrap";
import SlideToggle from "react-slide-toggle";

import {
  getBrands,
  getCategories,
  getProductDetails,
  RoughInTrimOutEnum,
  setIsFavorite,
  setProduct,
} from "../../actions/productActions";
import {
  editProduct,
  getProjectByProjectID,
  handleProductForProject,
  saveProject,
  setSelectedProject,
  updateProjectProdcutNotes,
  updateQuantity,
  updateRequiresApproval,
} from "../../actions/projectActions";
import { setSelectedRoom } from "../../actions/roomActions";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty, isUndefined } from "lodash";
import "./Products.scss";
import { useHistory } from "react-router";
import CustomLightbox from "../Lightbox";
import Multiselect from "multiselect-react-dropdown";
import { ProjectStatus } from "../../utils/contants";
import { PRODUCT_SELECTED_ROOM } from "../../actions/types";
import {
  deleteMyProductsForProject,
  getMyProductsForProject,
  updateBuilderRoomProduct,
  updateMyProductsForProject,
} from "../../actions/myProductActions";

const Products = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const project = useSelector((state) => state.project.project);
  const productsLoading = useSelector((state) => state.productsLoading);
  const selectedRoom = useSelector((state) => state.room.selectedRoom);
  const isFavorite = useSelector((state) => state.product.isFavorite);
  const roughInTrimOut = useSelector((state) => state.product.roughInTrimOut);
  const brands = useSelector((state) => state.product.brands);
  const categories = useSelector((state) => state.product.productCategories);
  const [brandOptions, setBrandOptions] = useState([]);
  const [roomsOptions, setRoomsOptions] = useState([]);
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [SubCategoriesOptions, setSubCategoriesOptions] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedMyProductsRooms, setSelectedMyProductsRooms] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [roomsDropdownLoading, setRoomsDropdownLoading] = useState(true);
  const [brandsDropdownLoading, setBrandsDropdownLoading] = useState(true);
  const [categoriesDropdownLoading, setCategoriesDropdownLoading] =
    useState(true);
  const [tempProduct, setTempProduct] = useState({});
  const [templateItems, setTemplateItems] = useState({});
  const [isRequiresApprovalLoading, setIsRequiresApprovalLoading] = useState({
    loading: false,
  });
  const [isQuantityLoading, setIsQuantityLoading] = useState({
    loading: false,
  });

  const [isNotesLoading, setIsNotesLoading] = useState(false);
  const [notes, setNotes] = useState(" ");
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedProductItem, setSelectedProductItem] = useState({});
  const [showCustomProducts, setShowCustomProducts] = useState(false);
  const [showBuilderRooms, setShowBuilderRooms] = useState(false);
  const [showSelectedRooms, setShowSelectedRooms] = useState(false);

  const [productFilter, setProductFilter] = useState({
    rooms: [],
    categories: [],
    subcategories: [],
    brands: [],
    pageNumber: 1,
    pageSize: 20,
  });
  const myProductsByProject = useSelector(
    (state) => state.myProduct.myProductsByProject
  );
  const handleSelectedRoom = useCallback(
    (selectedRooms) => {
      const rooms = [...selectedRooms.map((b) => b.ID)];

      setProductFilter({ ...productFilter, rooms: rooms, pageNumber: 1 });
      dispatch({ type: PRODUCT_SELECTED_ROOM, payload: rooms });
    },
    [dispatch, productFilter]
  );

  const handleBrandChange = useCallback(
    (selectedBrands) => {
      const brands = [...selectedBrands.map((b) => b.ID)];
      setProductFilter({ ...productFilter, brands: brands, pageNumber: 1 });
    },
    [dispatch, productFilter]
  );

  const handleCategoryChange = useCallback(
    (selectedCategories) => {
      const categories = [...selectedCategories.map((b) => b.ID)];
      setProductFilter({
        ...productFilter,
        categories: categories,
        pageNumber: 1,
      });
    },
    [dispatch, productFilter]
  );

  const handleSubCategoryChange = useCallback(
    (selectedCategories) => {
      const subcategories = [...selectedCategories.map((b) => b.ID)];
      setProductFilter({
        ...productFilter,
        subcategories: subcategories,
        pageNumber: 1,
      });
    },
    [dispatch, productFilter]
  );

  // useEffect(() => {
  //     dispatch(getProducts({...productFilter, projectId: project?.ID}));
  // }, [dispatch, productFilter])

  useEffect(() => {
    setBrandsDropdownLoading(true);
    dispatch(getBrands());
  }, [dispatch]);

  useEffect(() => {
    if (brands) {
      let options = [
        {
          name: "Select All",
          value: "select_all",
        },
        ...brands?.map((b) => {
          return {
            ...b,
            name: b.Name,
            value: b.ID,
          };
        }),
      ];
      setBrandOptions(options);
      setBrandsDropdownLoading(false);
    }
  }, [brands]);

  useEffect(() => {
    setCategoriesDropdownLoading(true);
    dispatch(getCategories());
    dispatch(getMyProductsForProject(project?.ID));
  }, [dispatch]);

  useEffect(() => {
    if (categories) {
      let options = [
        {
          name: "Select All",
          value: "select_all",
        },
        ...categories
          .filter((c) => c.ParentId === null)
          ?.map((b) => {
            return {
              ...b,
              name: b.Name?.replaceAll("&nbsp;", ""),
              value: b.ID,
            };
          })
          .sort((a, b) => {
            return a.Path?.localeCompare(b.Path);
          }),
      ];
      setCategoriesOptions(options);
      setCategoriesDropdownLoading(false);
    }
  }, [categories]);

  useEffect(() => {
    // productFilter?.categories?.include(c.ParentId)
    // if(productFilter?.categories.length){
    let options = [
      {
        name: "Select All",
        value: "select_all",
      },
      ...categories
        .filter((c) => productFilter?.categories.some((d) => d === c.ParentId))
        ?.map((b) => {
          return {
            ...b,
            name: b.Name?.replaceAll("&nbsp;", ""),
            value: b.ParentId,
          };
        })
        .sort((a, b) => {
          return a.Path?.localeCompare(b.Path);
        }),
    ];
    setSubCategoriesOptions(options);
    setCategoriesDropdownLoading(false);
    // }
  }, [productFilter, categories]);

  useEffect(() => {
    setRoomsDropdownLoading(true);
    let options = [
      {
        name: "Select All",
        value: "select_all",
        selected: true,
      },
      ...getProjectRoomsConditionally()?.map((b) => {
        return {
          ...b,
          name: b.RoomName,
          value: b.ID,
        };
      }),
    ];
    handleSelectedRoom(options.filter((p) => p.value !== "select_all"));
    setRoomsOptions(options);

    setRoomsDropdownLoading(false);
  }, [project, showBuilderRooms]);

  useEffect(() => {
    const rooms = getProjectRoomsConditionally()
      .filter((r) => productFilter.rooms.indexOf(r.ID) > -1)
      .map((room, index) => {
        return { ...room, isOpen: index === 0 };
      });
    setSelectedRooms(rooms);
  }, [project, productFilter, showBuilderRooms]);

  const getProjectRoomsConditionally = () => {
    return showBuilderRooms
      ? project?.BuilderProjectRooms
      : project?.ProjectRooms;
  };

  useEffect(() => {
    if (myProductsByProject?.length) {
      const filtered = mergeDuplicatesAsArray(
        myProductsByProject,
        "ProjectRoomID"
      );

      const rooms = filtered
        ?.map((mp, index) => {
          const isFound = getProjectRoomsConditionally()?.find(
            (r) => r.ID === mp.ID
          );

          if (isFound) {
            return {
              ...isFound,
              ...mp,
              isOpen: index === 0,
            };
          } else return { ...mp, isOpen: index === 0 };
        })
        .filter((r) => productFilter.rooms.indexOf(r.ID) > -1);

      // let rooms = {items: []};
      // filtered?.map((mp, index) => {
      //   rooms = {
      //     items: [...rooms.items, ...mp.Items],
      //   };
      //   return mp;
      // });

      setSelectedMyProductsRooms(rooms);
    }
  }, [myProductsByProject, productFilter, project]);

  const handleSelectedCategoryID = (templateItem) => {
    if (!templateItem) return;

    if (templateItem) {
      const product = {
        ID: templateItem?.ID,
        Quantity: 1,
        TemplateItemID: templateItem.ID,
        CategoryID: templateItem.CategoryID,
        RoughInTrimOutEnum: "RoughIn",
        IsApproved: false,
      };

      dispatch(setSelectedRoom(templateItem.room));

      dispatch(setProduct(product))
        .then(dispatch(getCategories(product?.CategoryID)))
        .then(() => {
          if (templateItem.ProductID) {
            dispatch(getProductDetails(templateItem.ProductID)).then(() => {
              if (templateItem?.IsTemplate) {
                history.push(
                  `/project/${project.ProjectNumber}/product/addProduct`
                );
              } else {
                history.push(
                  `/project/${project.ProjectNumber}/product/replaceProduct`
                );
              }
            });
          } else {
            history.push(
              `/project/${project.ProjectNumber}/product/addProduct`
            );
          }
        })
        .catch(() => {});
    }
  };

  const handleDeleteProduct = (product) => {
    if (showCustomProducts || showBuilderRooms) {
      dispatch(deleteMyProductsForProject(selectedProductItem?.ID)).then(() => {
        if (showBuilderRooms) {
          dispatch(getProjectByProjectID(project?.ID)).then(() => {
            setShowModal(false);
          });
        } else
          dispatch(getMyProductsForProject(project?.ID)).then(() => {
            setShowModal(false);
          });
      });
    } else {
      if (!product || !product.room?.ID) return;

      const productDeleteObj = {
        ID: product.ID,
        Quantity: 0,
        ProductID: product.ProductID,
        ProjectRoomID: product.room.ID,
        IsApproved: product.IsApproved,
        IsFavorite: product.IsFavorite,
        TemplateItemID: product.TemplateID,
        RequiredApproval: product.RequiredApproval,
        RoughInTrimOutEnum: product.RoughInTrimOutEnum,
      };

      dispatch(handleProductForProject([productDeleteObj])).then(() => {
        setShowModal(false);
      });
    }
  };

  const handleOpenModal = (item) => {
    if (item.IsTemplate) return;

    setSelectedProductItem(item);
    setTempProduct(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setTempProduct({});
    setShowModal(false);
  };

  const handleRequiresApproval = (templateItem, RequiresApproval) => {
    if (!isRequiresApprovalLoading?.loading) {
      setIsRequiresApprovalLoading({ loading: true, ID: templateItem?.ID });
      async function callback() {
        if (showCustomProducts) {
          await dispatch(getMyProductsForProject(project?.ID));
        }
        setTimeout(() => {
          setIsRequiresApprovalLoading({ loading: false });
        }, 100);
      }

      if (showCustomProducts) {
        handleUpdateMyProductsForProject(
          "RequiresApproval",
          RequiresApproval,
          callback,
          templateItem
        );
      } else if (showBuilderRooms) {
        dispatch(
          updateBuilderRoomProduct(
            project?.ID,
            templateItem?.ID,
            RequiresApproval,
            "RequiresApproval"
          )
        ).then(() => {
          dispatch(getProjectByProjectID(project?.ID)).then(() => {
            setIsRequiresApprovalLoading({ loading: false });
          });
        });
      } else {
        dispatch(
          updateRequiresApproval(
            project?.ID,
            templateItem?.ID,
            RequiresApproval
          )
        ).then((project) => {
          dispatch(setSelectedProject(project));
          setIsRequiresApprovalLoading({ loading: false });
        });
      }
    }
  };

  const handleQuantity = (templateItem, quantity) => {
    if (!isQuantityLoading?.loading) {
      setIsQuantityLoading({ loading: true, ID: templateItem?.ID });

      async function callback() {
        if (showCustomProducts) {
          await dispatch(getMyProductsForProject(project?.ID));
        }
        setTimeout(() => {
          setIsQuantityLoading({ loading: false });
        }, 100);
      }

      if (showCustomProducts) {
        handleUpdateMyProductsForProject("Quantity", quantity, callback);
      } else if (showBuilderRooms) {
        dispatch(
          updateBuilderRoomProduct(
            project?.ID,
            templateItem?.ID,
            quantity,
            "Quantity"
          )
        ).then(() => {
          dispatch(getProjectByProjectID(project?.ID)).then(() => {
            setIsQuantityLoading({ loading: false });
          });
        });
      } else {
        dispatch(updateQuantity(project?.ID, templateItem?.ID, quantity)).then(
          (project) => {
            dispatch(setSelectedProject(project));
            setIsQuantityLoading({ loading: false });
          }
        );
      }
    }
  };

  const handleItems = (incomingItem, key, value) => {
    async function callback() {
      dispatch(getMyProductsForProject(project?.ID));
    }

    if (showCustomProducts) {
      handleUpdateMyProductsForProject(
        "RoughInTrimOut",
        value,
        callback,
        incomingItem
      );
    } else if (showBuilderRooms) {
      dispatch(
        updateBuilderRoomProduct(
          project?.ID,
          incomingItem?.ID,
          value,
          "RoughInTrimOutEnum"
        )
      ).then(() => {
        dispatch(getProjectByProjectID(project?.ID));
      });
    } else {
      dispatch(RoughInTrimOutEnum(project?.ID, incomingItem?.ID, value)).then(
        () => {
          dispatch(saveProject(roughInTrimOut));
        }
      );
    }
    if (!incomingItem?.ID) return;

    let newValue = value;

    if (key === "RequiresApproval") newValue = !value;

    if (!templateItems?.[incomingItem?.ID]) {
      setTemplateItems({
        ...templateItems,
        [incomingItem?.ID]: {
          ...incomingItem,
          TemplateItemID: incomingItem?.ID,
          CategoryID: incomingItem?.CategoryID,
          requiresApproval: false,
          Quantity: 1,
          [key]: newValue,
        },
      });
    } else {
      setTemplateItems({
        ...templateItems,
        [incomingItem?.ID]: {
          ...templateItems?.[incomingItem?.ID],
          [key]: newValue,
        },
      });
    }
  };

  const handleIsFavorite = (item) => {
    dispatch(setIsFavorite(project?.ID, item?.ID, !item?.IsFavorite)).then(
      () => {
        dispatch(saveProject(isFavorite)).then(() => {});
      }
    );
  };

  const saveProducts = () => {
    if (isEmpty(templateItems)) return;

    setIsLoading(true);
    const updatedItems = Object.keys(templateItems)?.map((itemKey) => {
      return {
        ID: parseInt(itemKey),
        ProjectRoomID: templateItems[itemKey].room?.ID,
        ...templateItems[itemKey],
      };
    });

    dispatch(editProduct(updatedItems)).then(() => {
      setIsLoading(false);
    });
  };

  const deleteModal = () => {
    return (
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <div className="p-3">
          <b>Delete Product</b>
        </div>
        <Modal.Body>
          Are you sure you want to delete this product?
          <div className="d-flex justify-content-center pt-5">
            <Button
              variant="link"
              className="cancel"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              className="primary-gray-btn next-btn ml-3"
              onClick={() => handleDeleteProduct(tempProduct)}
            >
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    );
  };
  const itemLoading = (templateItem, loadingObj) => {
    return loadingObj?.loading && loadingObj?.ID === templateItem?.ID;
  };

  const renderApproval = (templateItem) => {
    let status = {};

    if (!templateItem?.RequiresApproval) return;

    switch (templateItem?.ApprovalStatusID) {
      case 0 | null:
        {
          status = {
            label: "",
            className: "",
          };
        }
        break;
      case -1:
        {
          status = {
            label: "Rejected",
            className: "text-danger",
          };
        }
        break;

      case 1:
        {
          status = {
            label: "Approved",
            className: "text-success",
          };
        }
        break;

      default: {
        status = {};
      }
    }

    if (!status?.label) {
      return null;
    }

    return templateItem?.DateApproved ? (
      <div className="d-flex flex-column align-items-left">
        <small className={`${status?.className} font-weight-bold`}>
          {status?.label}
        </small>
        <small className={`${status?.className} font-weight-bold`}>
          {new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).format(new Date(templateItem?.DateApproved))}
        </small>
      </div>
    ) : (
      <small className={`${status?.className} font-weight-bold p-1`}>
        {status?.label}
      </small>
    );
  };

  const cancelNotesModal = () => {
    setShowNotesModal(false);
    setNotes(selectedProductItem?.Notes);
  };

  const handleOpenNotesModal = (item) => {
    setSelectedProductItem(item);
    setNotes(item?.Notes);
    setShowNotesModal(true);
  };

  const saveAsNewNotes = () => {
    if (!selectedProductItem?.ProductID) return;
    setIsNotesLoading(true);

    function callback() {
      setIsNotesLoading(false);
      cancelNotesModal();

      if (showCustomProducts) {
        dispatch(getMyProductsForProject(project?.ID));
      }
    }

    if (showCustomProducts) {
      handleUpdateMyProductsForProject("Notes", notes, callback);
    } else if (showBuilderRooms) {
      dispatch(
        updateBuilderRoomProduct(
          project?.ID,
          selectedProductItem?.ID,
          notes,
          "Notes"
        )
      ).then(() => {
        dispatch(getProjectByProjectID(project?.ID)).then(() => {
          setIsNotesLoading(false);
          cancelNotesModal();
        });
      });
    } else {
      dispatch(
        updateProjectProdcutNotes(project?.ID, selectedProductItem?.ID, notes)
      )
        .then((project) => {
          callback();
        })
        .catch(() => {
          alert("Something went wrong creating copy of project try again");
        });
    }
  };

  const handleUpdateMyProductsForProject = (key, value, callback, item) => {
    const product = item ? item : selectedProductItem;
    const params = {
      ID: product?.ID,
      ProjectID: project?.ID,
      ProductID: product?.ProductID,
      ProjectRoomID: [product?.ProjectRoomID],
      Quantity: Number(product?.Quantity),
      VendorID: product?.VendorID,
      IsApproved: product?.IsApproved,
      RequiresApproval: product?.RequiresApproval,
      DefaultRoomProductID: product?.DefaultRoomProductID,
      RoughInTrimOut: product?.RoughInTrimOut ? "RoughIn" : "TrimOut",
      Notes: product?.Notes,
      [key]: value,
    };
    dispatch(updateMyProductsForProject(params))
      .then(() => {
        callback?.();
      })
      .catch(() => {
        alert("Something went wrong creating copy of project try again");
      });
  };

  const saveNotesModal = () => {
    return (
      <Modal
        size="md"
        centered
        show={showNotesModal}
        className="notes-modal"
        onHide={() => setShowNotesModal(false)}
      >
        <Modal.Body className="modal-container">
          <Form>
            <Form.Label className="input-label">Product Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              className="input-gray"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Form>
          <div className="d-flex justify-content-center mt-3">
            {isNotesLoading ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              <>
                <Button
                  variant="link"
                  className="cancel"
                  onClick={cancelNotesModal}
                >
                  Cancel
                </Button>
                <Button
                  className="primary-gray-btn next-btn ml-3"
                  onClick={saveAsNewNotes}
                >
                  Save
                </Button>
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  const getProductImages = (product) => {
    const images = [];
    if (product?.ProductThumbnailURl) images.push(product?.ProductThumbnailURl);

    if (product?.ThumbnailURL) images.push(product?.ThumbnailURL);

    if (product?.ImageURL) images.push(product?.ImageURL);

    return images;
  };

  const renderTable = (items) => {
    return (
      <div className="products-table">
        <Table responsive>
          <thead>
            <tr>
              <th>Needs Approval</th>
              <th>
                <div className="d-flex justify-content-center">
                  Product Name
                </div>
              </th>
              {productFilter?.rooms.length > 1 && !showCustomProducts ? (
                <th>
                  <div className="d-flex justify-content-center">Room</div>
                </th>
              ) : null}
              <th>Description</th>
              <th>Category</th>
              <th>UOM</th>
              <th className="radios">Rough In / Trim Out</th>
              <th>Distributor</th>
              <th>QTY</th>
              <th>Price</th>
              <th>Customer Approval</th>
              <th>Notes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items?.map((templateItem, index) => {
              const tempTemplateItem = templateItems?.[templateItem?.ID];

              let requiresApproval = !!templateItem?.RequiresApproval;
              let isRoughIn = templateItem?.RoughInTrimOutEnum === "RoughIn";
              let isTrimOut = templateItem?.RoughInTrimOutEnum === "TrimOut";
              let quantity = templateItem?.Quantity
                ? templateItem?.Quantity
                : 1;
              let isFav = templateItem?.IsFavorite;

              if (!isEmpty(tempTemplateItem)) {
                quantity = tempTemplateItem.Quantity;
                requiresApproval = tempTemplateItem.RequiresApproval;
                isRoughIn = tempTemplateItem.RoughInTrimOutEnum === "RoughIn";
                isTrimOut = tempTemplateItem.RoughInTrimOutEnum === "TrimOut";
              }
              return (
                <tr key={index}>
                  <td className="approval-checkbox">
                    <div className="d-flex justify-content-center">
                      <Form>
                        {itemLoading(
                          templateItem,
                          isRequiresApprovalLoading
                        ) ? (
                          <Spinner animation="border" variant="primary" />
                        ) : (
                          <Form.Check
                            type="checkbox"
                            checked={templateItem?.RequiresApproval}
                            disabled={
                              isUndefined(templateItem?.RequiresApproval)
                                ? true
                                : false
                            }
                            onChange={() =>
                              handleRequiresApproval(
                                templateItem,
                                !templateItem?.RequiresApproval
                              )
                            }
                          />
                        )}
                      </Form>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex add-btn-templateItem">
                      {getProductImages(templateItem)?.length ? (
                        <CustomLightbox
                          images={getProductImages(templateItem)}
                        />
                      ) : null}
                      <div>
                        <Button
                          variant="link"
                          className="link-btn item-button"
                          onClick={() => handleSelectedCategoryID(templateItem)}
                        >
                          {templateItem?.IsTemplate ? (
                            <>
                              <i className="fas fa-plus-circle plus-circle"></i>
                              {templateItem?.AddLabel}
                            </>
                          ) : (
                            <>{templateItem?.ProductName}</>
                          )}
                        </Button>

                        {!templateItem?.IsTemplate && (
                          <div className="model-number">
                            Model: {templateItem?.ModelNumber}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  {productFilter?.rooms.length > 1 && !showCustomProducts ? (
                    <td>{templateItem?.room?.RoomName}</td>
                  ) : null}
                  <td>{templateItem?.ShortDescription}</td>
                  <td>{templateItem?.CategoryName}</td>
                  <td>{templateItem?.UnitOfMeasure}</td>
                  <td>
                    {!templateItem?.IsTemplate && (
                      <Form className="d-flex justify-content-center">
                        <Form.Check
                          type="radio"
                          checked={isRoughIn}
                          disabled={templateItem?.IsTemplate}
                          onChange={() =>
                            handleItems(
                              templateItem,
                              "RoughInTrimOutEnum",
                              "RoughIn"
                            )
                          }
                        />
                        <Form.Check
                          type="radio"
                          checked={isTrimOut}
                          disabled={templateItem?.IsTemplate}
                          onChange={() =>
                            handleItems(
                              templateItem,
                              "RoughInTrimOutEnum",
                              "TrimOut"
                            )
                          }
                        />
                      </Form>
                    )}
                  </td>
                  <td>
                    {!templateItem?.IsTemplate && (
                      <div className="distributor-select">
                        <Form.Control as="select"></Form.Control>
                      </div>
                    )}
                  </td>
                  <td>
                    {!templateItem?.IsTemplate && (
                      <div className="qty-input">
                        {itemLoading(templateItem, isQuantityLoading) ? (
                          <Spinner animation="border" variant="primary" />
                        ) : (
                          <Form.Control
                            min="0"
                            type="text"
                            id={`quantity-${templateItem?.ID}`}
                            // disabled={!templateItem?.Quantity}
                            defaultValue={templateItem?.Quantity}
                            onBlur={(e) =>
                              handleQuantity(templateItem, e.target.value)
                            }
                            onFocus={() => {
                              setSelectedProductItem(templateItem);
                            }}
                          ></Form.Control>
                        )}
                      </div>
                    )}
                  </td>
                  <td>
                    {templateItem?.Price || templateItem?.MSRP
                      ? `$${templateItem?.Price || templateItem?.MSRP}`
                      : ""}
                  </td>
                  <td>{renderApproval(templateItem)}</td>
                  {!templateItem?.IsTemplate ? (
                    <td
                      className={`${templateItem?.Notes && "sticky-note-red"}`}
                      onClick={() => handleOpenNotesModal(templateItem)}
                    >
                      {templateItem?.Notes ? (
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id="button-tooltip">
                              {templateItem?.Notes}
                            </Tooltip>
                          }
                          delay={{ show: 250, hide: 400 }}
                        >
                          <i className="far fa-sticky-note d-flex justify-content-center"></i>
                        </OverlayTrigger>
                      ) : (
                        <i className="far fa-sticky-note d-flex justify-content-center"></i>
                      )}
                    </td>
                  ) : (
                    <td />
                  )}
                  <td>
                    {!templateItem?.IsTemplate && (
                      <div className="d-flex justify-content-between">
                        <i className="fas fa-retweet"></i>
                        <i
                          className={`far ${
                            isFav ? "text-danger fas fa-heart" : "fa-heart"
                          }`}
                          onClick={() =>
                            !showCustomProducts
                              ? handleIsFavorite(templateItem)
                              : {}
                          }
                        ></i>
                        <i
                          className="far fa-trash-alt"
                          onClick={() => handleOpenModal(templateItem)}
                        ></i>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  };

  const handleRefresh = () => {};

  const showProducts = () => {
    dispatch(getCategories(""))
      .then(dispatch(setProduct({})))
      .then(() => {
        history.push(`/project/${project.ProjectNumber}/product/addProduct`);
      })
      .catch(() => {});
  };

  const handleShowCustomProducts = () => {
    history.push(`/project/${project.ProjectNumber}/product/addCustomProducts`);
  };

  const onRemove = (selectedList, removedItem) => {};
  console.log(showCustomProducts, selectedMyProductsRooms, "roomsOptions");
  return (
    <div className="d-flex products">
      <div className="products-container">
        <div className="d-flex justify-content-between flex-wrap">
          <div>
            <div className="page-title">Products</div>
          </div>
          <div>
            <Button
              variant="link"
              className="link-btn"
              onClick={handleShowCustomProducts}
            >
              + Add Custom Products
            </Button>
            <Button variant="link" className="link-btn" onClick={showProducts}>
              + Add Products
            </Button>
            <Button variant="link" className="link-btn">
              <i className="fas fa-download"></i>
              Download Report
            </Button>
            <Button variant="link" className="link-btn">
              <i className="fas fa-share-alt"></i>
              Share to Distributor
            </Button>
            <Button variant="link" className="link-btn">
              <i className="fas fa-share-square"></i>
              Share to Customer
            </Button>
            <Button variant="link" className="link-btn">
              <i className="fas fa-th"></i>
              Category Layout
            </Button>
            <span className="total float-right mt-3">Total: $0.00</span>
          </div>
        </div>
        <div className="subtext">
          The products assigned to each room are displayed below.
        </div>
        <div className="ml-3">
          {roomsDropdownLoading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              <div className="input-label mt-2 ml-3 mb-2 d-flex justify-content-between align-items-center">
                Selected Rooms
                <div
                  className="pointer text-primary"
                  onClick={() => setShowSelectedRooms(!showSelectedRooms)}
                >
                  {showSelectedRooms
                    ? "Hide Selected Rooms"
                    : "Visible Selected Rooms"}
                </div>
              </div>
              <div className="mx-2 position-relative">
                <span>
                  {roomsOptions?.find((r) => r.value === "select_all")
                    ?.selected || !showSelectedRooms
                    ? DrawDropdownSelection({
                        items: getProjectRoomsConditionally(),
                        selectedIds: productFilter?.rooms,
                        nameProp: "Name",
                        type: "room",
                        styles: {
                          position: "absolute",
                          top: "8px",
                          left: "8px",
                        },
                      })
                    : null}
                </span>
                <Multiselect
                  tags
                  showArrow
                  className="tags-dropdown readonly_ms"
                  // disable={true}
                  placeholder=""
                  showCheckbox={true}
                  keepSearchTerm={false}
                  hidePlaceholder={true}
                  hideSelectedList={
                    roomsOptions?.find((r) => r.value === "select_all")
                      ?.selected && !showSelectedRooms
                  }
                  options={roomsOptions} // Options to display in the dropdown
                  selectedValues={
                    !productFilter?.rooms
                      ? []
                      : getProjectRoomsConditionally()?.length ===
                        productFilter?.rooms?.length
                      ? roomsOptions
                      : roomsOptions.filter(
                          (b) => productFilter?.rooms.indexOf(b.ID) > -1
                        )
                  }
                  displayValue="name" // Property name to display in the dropdown options
                  onSelect={(arr, current) => {
                    if (current.value === "select_all") {
                      handleSelectedRoom(
                        roomsOptions.filter((p) => p.value !== "select_all")
                      );
                      setRoomsOptions(
                        roomsOptions.map((r) =>
                          r.value === "select_all"
                            ? { ...r, selected: !r.selected }
                            : r
                        )
                      );
                    } else {
                      handleSelectedRoom(
                        arr.sort((a, b) =>
                          a.name < b.name ? -1 : a.name > b.name ? 1 : 0
                        )
                      );
                    }
                  }}
                  onRemove={(arr, target) => {
                    let rooms = arr
                      .filter((p) => p.value !== "select_all")
                      .sort((a, b) =>
                        a.name < b.name ? -1 : a.name > b.name ? 1 : 0
                      );
                    if (target.value === "select_all") {
                      rooms = [];
                      setRoomsOptions(
                        roomsOptions.map((r) =>
                          r.value === "select_all"
                            ? { ...r, selected: false }
                            : r
                        )
                      );
                    }
                    handleSelectedRoom(rooms);
                  }}
                />
              </div>
            </>
          )}
        </div>

        <div className="ml-3">
          <div className="d-flex flex-wrap">
            {/* <div>
                            <div className='input-label mt-2 ml-3'>Room</div>
                            <div className="layout-select custom-dropdown">
                                {roomsDropdownLoading ?
                                    <div className='text-center'>
                                        <span></span>
                                        <Spinner
                                            animation='border'
                                            variant='primary'
                                        />
                                    </div> :
                                <>
                                    <span>
                                    {DrawDropdownSelection({items: getProjectRoomsConditionally(), selectedIds:  productFilter?.rooms, nameProp: "RoomName", type: "room"})}
                                    </span>

                                    <Multiselect
                                        options={
                                            roomsOptions?.length > 0 ? roomsOptions : []}
                                        selectedValues={!productFilter?.rooms ? [] : (
                                            getProjectRoomsConditionally()?.length === productFilter?.rooms?.length ? roomsOptions : roomsOptions.filter(b => productFilter?.rooms.indexOf(b.ID) > -1)
                                        )}
                                        onSelect={(arr, current) => {
                                            if (current.value === 'select_all') {
                                                handleSelectedRoom(roomsOptions.filter(p => p.value !== 'select_all'))
                                            } else
                                                handleSelectedRoom(arr.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
                                        }}
                                        onRemove={(arr, target) => {
                                            let rooms = arr.filter(p => p.value !== 'select_all').sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
                                            if (target.value === 'select_all') {
                                                rooms = [];
                                            }
                                            handleSelectedRoom(rooms)
                                        }}
                                        displayValue="name"
                                        placeholder=""
                                        showCheckbox={true}
                                        keepSearchTerm={false}
                                        hidePlaceholder={true}
                                    />
                                    </>
                                }
                            </div>
                        </div> */}

            <div>
              <div className="input-label mt-2 ml-3">Parent Category</div>
              <div className="layout-select custom-dropdown">
                {categoriesDropdownLoading ? (
                  <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <>
                    <span>
                      {DrawDropdownSelection({
                        items: categories,
                        selectedIds: productFilter?.categories,
                        nameProp: "Name",
                        type: "category",
                      })}
                    </span>
                    <Multiselect
                      options={
                        categoriesOptions?.length > 0 ? categoriesOptions : []
                      }
                      selectedValues={
                        !productFilter?.categories
                          ? []
                          : categories?.length ===
                            productFilter?.categories?.length
                          ? categoriesOptions
                          : categoriesOptions.filter(
                              (b) =>
                                productFilter?.categories.indexOf(b.ID) > -1
                            )
                      }
                      onSelect={(arr, current) => {
                        if (current.value === "select_all") {
                          handleCategoryChange(
                            categoriesOptions.filter(
                              (p) => p.value !== "select_all"
                            )
                          );
                        } else
                          handleCategoryChange(
                            arr.sort((a, b) =>
                              a.name < b.name ? -1 : a.name > b.name ? 1 : 0
                            )
                          );
                      }}
                      onRemove={(arr, target) => {
                        let categories = arr
                          .filter((p) => p.value !== "select_all")
                          .sort((a, b) =>
                            a.name < b.name ? -1 : a.name > b.name ? 1 : 0
                          );
                        if (target.value === "select_all") {
                          categories = [];
                        }
                        handleCategoryChange(categories);
                      }}
                      displayValue="name"
                      placeholder=""
                      showCheckbox={true}
                      keepSearchTerm={false}
                      hidePlaceholder={true}
                    />
                  </>
                )}
              </div>
            </div>
            <div>
              <div className="input-label mt-2 ml-3">Child Category</div>
              <div className="layout-select custom-dropdown">
                {categoriesDropdownLoading ? (
                  <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <>
                    <span>
                      {DrawDropdownSelection({
                        items: categories,
                        selectedIds: productFilter?.subcategories,
                        nameProp: "Name",
                        type: "subcategory",
                      })}
                    </span>
                    <Multiselect
                      options={
                        SubCategoriesOptions?.length > 0
                          ? SubCategoriesOptions
                          : []
                      }
                      selectedValues={
                        !productFilter?.subcategories
                          ? []
                          : categories?.length ===
                            productFilter?.subcategories?.length
                          ? SubCategoriesOptions
                          : SubCategoriesOptions.filter(
                              (b) =>
                                productFilter?.subcategories.indexOf(b.ID) > -1
                            )
                      }
                      onSelect={(arr, current) => {
                        if (current.value === "select_all") {
                          handleSubCategoryChange(
                            SubCategoriesOptions.filter(
                              (p) => p.value !== "select_all"
                            )
                          );
                        } else
                          handleSubCategoryChange(
                            arr.sort((a, b) =>
                              a.name < b.name ? -1 : a.name > b.name ? 1 : 0
                            )
                          );
                      }}
                      onRemove={(arr, target) => {
                        let categories = arr
                          .filter((p) => p.value !== "select_all")
                          .sort((a, b) =>
                            a.name < b.name ? -1 : a.name > b.name ? 1 : 0
                          );
                        if (target.value === "select_all") {
                          categories = [];
                        }
                        handleSubCategoryChange(categories);
                      }}
                      displayValue="name"
                      placeholder=""
                      showCheckbox={true}
                      keepSearchTerm={false}
                      hidePlaceholder={true}
                    />
                  </>
                )}
              </div>
            </div>
            <div>
              <div className="input-label mt-2 ml-3">Brand</div>
              <div className="layout-select custom-dropdown">
                {brandsDropdownLoading ? (
                  <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <>
                    <span>
                      {DrawDropdownSelection({
                        items: brands,
                        selectedIds: productFilter?.brands,
                        nameProp: "Name",
                        type: "brand",
                      })}
                    </span>
                    <Multiselect
                      options={brandOptions?.length > 0 ? brandOptions : []}
                      selectedValues={
                        !productFilter?.brands
                          ? []
                          : brands?.length === productFilter?.brands?.length
                          ? brandOptions
                          : brandOptions.filter(
                              (b) => productFilter?.brands.indexOf(b.ID) > -1
                            )
                      }
                      onSelect={(arr, current) => {
                        if (current.value === "select_all") {
                          handleBrandChange(
                            brandOptions.filter((p) => p.value !== "select_all")
                          );
                        } else
                          handleBrandChange(
                            arr.sort((a, b) =>
                              a.name < b.name ? -1 : a.name > b.name ? 1 : 0
                            )
                          );
                      }}
                      onRemove={(arr, target) => {
                        let brands = arr
                          .filter((p) => p.value !== "select_all")
                          .sort((a, b) =>
                            a.name < b.name ? -1 : a.name > b.name ? 1 : 0
                          );
                        if (target.value === "select_all") {
                          brands = [];
                        }
                        handleBrandChange(brands);
                      }}
                      displayValue="name"
                      placeholder=""
                      showCheckbox={true}
                      keepSearchTerm={false}
                      hidePlaceholder={true}
                    />
                  </>
                )}
              </div>
            </div>
            <div className="d-flex align-items-center pt-2 ml-3">
              <Form.Check
                type="checkbox"
                checked={showCustomProducts}
                onChange={() => {
                  if (showBuilderRooms && !showCustomProducts) {
                    setShowBuilderRooms(false);
                  }
                  setShowCustomProducts(!showCustomProducts);
                }}
                label={`Show Custom Products`}
              />
            </div>
            <div className="d-flex align-items-center pt-2 ml-3">
              <Form.Check
                type="checkbox"
                checked={showBuilderRooms}
                onChange={() => {
                  if (showCustomProducts && !showBuilderRooms) {
                    setShowCustomProducts(false);
                  }
                  setShowBuilderRooms(!showBuilderRooms);
                }}
                label={`Show Builder Rooms`}
              />
            </div>
          </div>
        </div>

        {deleteModal()}
        {saveNotesModal()}
        {/* {!showCustomProducts ? ( */}
        {
          (showCustomProducts ? selectedMyProductsRooms : selectedRooms).map(
            (data, roomIndex) => {
              let { Items, ...room } = data;
              let items = FilterItems({
                productFilter,
                items: Items,
                brands,
                categories,
                SubCategoriesOptions,
              })
                ?.map((i) => {
                  return { room: room, ...i };
                })
                ?.sort((a, b) => {
                  if (a.ShortDescription !== b.ShortDescription) {
                    return a.ShortDescription?.localeCompare(
                      b.ShortDescription
                    );
                  }
                  if (a.room?.RoomName !== b.room?.RoomName) {
                    return a.room?.RoomName?.localeCompare(b.room?.RoomName);
                  }
                  return 0;
                });
              return (
                <SlideToggle
                  onExpanded={({ hasReversed }) => {
                    let _room = selectedRooms.filter(
                      (r) => r.ID === room.ID
                    )[0];
                    _room.isOpen = true;
                    setSelectedRooms([...selectedRooms]);
                  }}
                  onCollapsed={({ hasReversed }) => {
                    let _room = selectedRooms.filter(
                      (r) => r.ID === room.ID
                    )[0];
                    _room.isOpen = false;
                    setSelectedRooms([...selectedRooms]);
                  }}
                  render={({ toggle, setCollapsibleElement }) => (
                    <Card className="ml-4 my-3 mr-2 accordion">
                      <Card.Header
                        className="pointer d-flex justify-content-between"
                        onClick={toggle}
                      >
                        {room.RoomName}{" "}
                        <div className="d-flex">
                          {room.RoomTypeName ? (
                            <span className="mx-2">
                              Room Type: <b>{room.RoomTypeName}</b>
                            </span>
                          ) : null}
                          <i
                            className={`far float-right mt-1 ${
                              room.isOpen
                                ? "fa-chevron-double-up"
                                : "fa-chevron-double-down"
                            }`}
                          ></i>
                        </div>
                      </Card.Header>
                      <Card.Body
                        id={"room-" + room.ID}
                        ref={setCollapsibleElement}
                      >
                        {renderTable(items)}
                      </Card.Body>
                    </Card>
                  )}
                />
              );
            }
          )
          // ) : (
          //   <div>{renderTable(selectedMyProductsRooms?.items)}</div>
          // )}
        }
        <div className="d-flex justify-content-center pt-5">
          {isLoading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <>
              {/* <Button 
                                variant='link' 
                                className='cancel'
                                // onClick={() => setShowModal(true)}
                            >
                                Cancel
                            </Button> */}
              <Button
                onClick={saveProducts}
                className="primary-gray-btn next-btn ml-3"
              >
                Save
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
export const FilterItems = ({
  productFilter,
  brands,
  categories,
  items,
  SubCategoriesOptions,
}) => {
  const selectedCategories = categories?.filter(
    (c) =>
      productFilter.categories.length > 0 &&
      productFilter.categories.indexOf(c.ID) > -1
  );

  const selectedBrands = brands
    ?.filter(
      (c) =>
        productFilter.brands.length > 0 &&
        productFilter.brands.indexOf(c.ID) > -1
    )
    .map((b) => b.ID);

  const selectedSubCategoriesOptions = SubCategoriesOptions?.filter(
    (c) =>
      productFilter.subcategories.length > 0 &&
      productFilter.subcategories.indexOf(c.ID) > -1
  ).map((b) => b.ID);

  const allCategories = selectedCategories
    // ?.filter((c) => {
    //   return (
    //     c.Path &&
    //     selectedCategories.filter((s) => {
    //       return s.Path && c.Path.startsWith(s.Path);
    //     }).length > 0
    //   );
    // })
    .map((c) => c.ID);
  return items?.filter((i) => {
    return (
      (productFilter.brands.length === 0 ||
        selectedBrands.indexOf(i.BrandID) > -1) &&
      (productFilter.categories.length === 0 ||
        allCategories.indexOf(i.CategoryID) > -1) &&
      (productFilter.subcategories.length === 0 ||
        selectedSubCategoriesOptions.indexOf(i.CategoryID) > -1)
    );
  });
};

export const DrawDropdownSelection = ({
  items,
  selectedIds,
  nameProp,
  type,
  styles = {},
}) => {
  const selectedLength = selectedIds?.length;
  const types = {
    room: { single: "Room", group: "Rooms" },
    category: { single: "Category", group: "Categories" },
    subcategory: { single: "SubCategory", group: "SubCategory" },
    brand: { single: "Brand", group: "Brands" },
  };
  let name = `No ${types[type].group} selected`;
  if (selectedLength === 1) {
    let item = items?.filter((p) => selectedIds.indexOf(p.ID) > -1)[0];
    name = item ? item[nameProp] : null;
  } else if (selectedLength > 1 && selectedLength < items.length) {
    name = `Multiple ${types[type].group}`;
  } else if (items?.length === selectedLength) {
    name = `All ${types[type].group}`;
  }

  return (
    <span className="custom-placeholder" style={styles}>
      {name?.replaceAll("&nbsp;", "")?.trim()}
    </span>
  );
};

function mergeDuplicatesAsArray(array, key) {
  const mergedArray = [];
  const map = new Map();

  for (const obj of array) {
    const keyValue = obj[key];

    if (map.has(keyValue)) {
      const existingObj = map.get(keyValue);
      existingObj.Items.push({
        ...obj.BuilderProduct,
        ...obj,
        ProductID: obj.BuilderProduct.ID,
      }); // Add object to the existing array
    } else {
      map.set(keyValue, {
        ID: keyValue,
        Items: [
          {
            ...obj.BuilderProduct,
            ...obj,
            ProductID: obj.BuilderProduct.ID,
          },
        ],
      });
    }
  }

  return Array.from(map.values());
}
