import React, { useCallback, useEffect, useMemo, useState } from "react";
import { customerSingleApproval } from "../../actions/projectActions";
import { Form, Spinner, Table } from "react-bootstrap";
import { setSelectedRoom } from "../../actions/roomActions";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty, isUndefined } from "lodash";
import moment from "moment";
import "./CustomerProducts.scss";
import {
  customerApprovalProducts,
  getCustomerProducts,
} from "../../actions/customerActions";
import ConfirmApproveAllModal from "../ConfirmApproveAllModal/ConfirmApproveAllModal";
import { GET_CUSTOMER_PRODUCTS } from "../../actions/types";
import CustomLightbox from "../Lightbox";
import Multiselect from "multiselect-react-dropdown";
import { getCategories } from "../../actions/productActions";

const CustomerProducts = (props) => {
  const dispatch = useDispatch();

  const customerProducts = useSelector((state) => state.customer.products);
  const project = useSelector((state) => state.project.project);
  const selectedRoom = useSelector((state) => state.room.selectedRoom);
  const customerproject = useSelector((state) => state.auth.customerproject);
  const [templateItems, setTemplateItems] = useState({});
  const [confirmApproveModal, setConfirmApproveModal] = useState(false);
  const [confirmRejectModal, setConfirmRejectModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmApproveModalSingle, setconfirmApproveModalSingle] =
    useState(false);
  const [confirmRejectModalSingle, setconfirmRejectModalSingle] =
    useState(false);
  const [selectedProduct, setSelectedProduct] = useState();
  const [showSpinner, setShowSpinner] = useState(false);
  const categories = useSelector((state) => state.product.productCategories);

  const [filters, setFilters] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // if (isEmpty(selectedRoom))
    //   dispatch(setSelectedRoom(project?.ProjectRooms?.[0]));

    dispatch(getCategories());
    dispatch(getCustomerProducts()).then((res) => {
      setIsLoading(false);
    });
  }, [dispatch, project, selectedRoom]);

  useEffect(() => {
    setProducts(customerProducts);
  }, [customerProducts]);

  useEffect(() => {
    let filteredList = [];
    if (filters.rooms?.length) {
      filteredList = customerProducts?.filter((p) =>
        filters.rooms.some((pp) => p.ProjectRoom.Name === pp.Name)
      );
    }

    if (filters.categories?.length) {
      filteredList = [
        ...(filters.rooms?.length ? filteredList : customerProducts)?.filter(
          (p) => filters.categories.some((pp) => p.Product.CategoryID === pp.ID)
        ),
      ];
    }

    setProducts(filteredList);
    if (!filters.categories?.length && !filters.rooms?.length) {
      setProducts(customerProducts);
    }
  }, [filters?.rooms, filters?.categories]);

  //   const handleSelectedRoom = useCallback(
  //     (roomID) => {
  //       const selectedRoomObj = project?.ProjectRooms?.find(
  //         (room) => room.ID === parseInt(roomID)
  //       );

  //       dispatch(setSelectedRoom(selectedRoomObj));
  //     },
  //     [dispatch, project]
  //   );

  //   useEffect(() => {
  //     if (!isEmpty(selectedRoom)) handleSelectedRoom(selectedRoom?.ID);
  //   }, [project, selectedRoom, handleSelectedRoom]);

  //   const handleItems = (incomingItem, key, value) => {
  //     if (!incomingItem?.ID) return;

  //     let newValue = value;

  //     if (key === "RequiresApproval") newValue = !value;

  //     if (!templateItems?.[incomingItem?.ID]) {
  //       setTemplateItems({
  //         ...templateItems,
  //         [incomingItem?.ID]: {
  //           ...incomingItem,
  //           TemplateItemID: incomingItem?.ID,
  //           CategoryID: incomingItem?.CategoryID,
  //           requiresApproval: false,
  //           Quantity: 1,
  //           [key]: newValue,
  //         },
  //       });
  //     } else {
  //       setTemplateItems({
  //         ...templateItems,
  //         [incomingItem?.ID]: {
  //           ...templateItems?.[incomingItem?.ID],
  //           [key]: newValue,
  //         },
  //       });
  //     }
  //   };

  const approvalSingle = (ID, ProductID, IsCustomProduct, StatusID, always) => {
    const object = {
      ID,
      ProductID,
      StatusID,
      StatusForAll: always ? StatusID : 0,
    };
    dispatch(customerApprovalProducts([object], IsCustomProduct)).then(() => {
      const filter = products.map((p) => {
        if (always && p.ProductID === ProductID) {
          return { ...p, ApprovalStatusID: StatusID };
        } else if (p.ID === ID) {
          return { ...p, ApprovalStatusID: StatusID };
        } else return p;
      });
      dispatch({ type: GET_CUSTOMER_PRODUCTS, payload: filter });
    });
    setconfirmApproveModalSingle(false);
    setconfirmRejectModalSingle(false);
  };

  const approvalAll = (StatusID, always) => {
    setShowSpinner(true);
    const sendData = products.map((p) => {
      return {
        ID: p.ID,
        ProductID: p.Product?.ID,
        StatusID,
        IsCustomProduct: p.IsCustomProduct,
        StatusForAll: always ? StatusID : 0,
      };
    });
    const customProducts = sendData
      .filter((p) => p.IsCustomProduct)
      .map((p) => {
        const obj = p;
        delete obj.IsCustomProduct;
        return obj;
      });
    const noCustomProducts = sendData
      .filter((p) => p.IsCustomProduct === false)
      .map((p) => {
        const obj = p;
        delete obj.IsCustomProduct;
        return obj;
      });
    const updated = products.map((p) => {
      return { ...p, ApprovalStatusID: StatusID };
    });
    if (customProducts?.length)
      dispatch(customerApprovalProducts(customProducts, true)).then(() => {
        dispatch({ type: GET_CUSTOMER_PRODUCTS, payload: updated });
        setShowSpinner(false);
        if (StatusID === 1) setConfirmApproveModal(false);
        if (StatusID === 2) setConfirmRejectModal(false);
      });
    if (noCustomProducts?.length)
      dispatch(customerApprovalProducts(noCustomProducts, false)).then(() => {
        dispatch({ type: GET_CUSTOMER_PRODUCTS, payload: updated });
        setShowSpinner(false);
        if (StatusID === 1) setConfirmApproveModal(false);
        if (StatusID === 2) setConfirmRejectModal(false);
      });
  };

  const roomOptions = useMemo(() => {
    const list = customerProducts
      ?.map((p) => ({ Name: p.ProjectRoom?.Name }))
      ?.filter((p) => p !== null);

    return [...new Map(list?.map((item) => [item.Name, item])).values()];
  }, [customerProducts]);

  function flattenArray(arr) {
    const result = [];

    arr.forEach((item) => {
      // Add the current item to the result array without its nested list property
      const { SubCategories, ...currentItem } = item;
      result.push(currentItem);

      // Recursively flatten any nested lists and add them to the result
      if (SubCategories && SubCategories.length > 0) {
        result.push(...flattenArray(SubCategories));
      }
    });

    return result;
  }

  const categoriesOptions = useMemo(() => {
    if (categories) {
      const flatArray = flattenArray(categories);
      const ids = customerProducts
        ?.map((p) => p.Product?.CategoryID)
        ?.filter((p) => p !== null);

      const list = flatArray
        ?.filter((c) => ids?.includes(c.ID))
        ?.map((b) => {
          return {
            ...b,
            name: b.Name?.replaceAll("&nbsp;", ""),
            value: b.ID,
          };
        })
        ?.sort((a, b) => a.name?.localeCompare(b.name));

      return list?.filter((b) => b.name);
    }
    return [];
  }, [categories]);

  return (
    <div className="d-flex products">
      <div className="products-container">
        {/* <div className='d-flex justify-content-between'>
                    <div>
                        <div className='page-title'>Products - {selectedRoom?.RoomName ? selectedRoom?.RoomName : ''}</div>
                        <div className='subtext'>The products assinged to each room are displayed below.</div>
                    </div>
                    
                </div> */}
        {/* 
        <div className="middle-section">
          <div className="d-flex">
            <div>
              <Form.Control
                as="select"
                value={selectedRoom?.ID}
                onChange={(e) => handleSelectedRoom(e.target.value)}
              >
                {project?.ProjectRooms?.map((projectRoom, index) => (
                  <option key={index} value={projectRoom?.ID}>
                    {projectRoom.RoomName}
                  </option>
                ))}
              </Form.Control>
            </div>
          </div>
        </div> */}

        <div
          className="d-flex justify-content-between pt-3"
          style={{ gap: "10px" }}
        >
          <div
            className="d-flex align-items-center flex-wrap"
            style={{ gap: "10px" }}
          >
            <div style={{ minWidth: "300px" }} className="ml-2">
              <Multiselect
                disabled={isLoading}
                onSearch={(value) =>
                  setFilters({
                    ...filters,
                    categorieSearchTerm: value,
                  })
                }
                tags
                showArrow
                className="tags-dropdown readonly_ms"
                // disable={true}
                placeholder="Filter by Categories"
                showCheckbox={true}
                keepSearchTerm={false}
                options={categoriesOptions} // Options to display in the dropdown
                selectedValues={filters.categories}
                displayValue="name" // Property name to display in the dropdown options
                onSelect={(arr, current) => {
                  setFilters({
                    ...filters,
                    categories: arr.sort((a, b) =>
                      a.name < b.name ? -1 : a.name > b.name ? 1 : 0
                    ),
                  });
                }}
                onRemove={(arr, target) => {
                  let list = arr.sort((a, b) =>
                    a.name < b.name ? -1 : a.name > b.name ? 1 : 0
                  );
                  setFilters({
                    ...filters,
                    categories: list,
                  });
                }}
              />
            </div>
            <div style={{ minWidth: "300px" }} className="ml-2">
              <Multiselect
                disabled={isLoading}
                onSearch={(value) =>
                  setFilters({
                    ...filters,
                    roomsSearchTerm: value,
                  })
                }
                tags
                showArrow
                className="tags-dropdown readonly_ms"
                // disable={true}
                placeholder="Filter by Rooms"
                showCheckbox={true}
                keepSearchTerm={false}
                options={roomOptions} // Options to display in the dropdown
                selectedValues={filters.rooms}
                displayValue="Name" // Property name to display in the dropdown options
                onSelect={(arr, current) => {
                  setFilters({
                    ...filters,
                    rooms: arr.sort((a, b) =>
                      a.name < b.name ? -1 : a.name > b.name ? 1 : 0
                    ),
                  });
                }}
                onRemove={(arr, target) => {
                  let list = arr.sort((a, b) =>
                    a.name < b.name ? -1 : a.name > b.name ? 1 : 0
                  );
                  setFilters({
                    ...filters,
                    rooms: list,
                  });
                }}
              />
            </div>
          </div>
          <div>
            <div className="d-flex justify-content-between">
              <button
                className="bg-success text-light mr-1 border-0 rounded px-2 py-1 fs-1"
                onClick={() => setConfirmApproveModal(true)}
                disabled={isLoading}
              >
                <i className="fas fa-check-double"></i> Approve All
              </button>

              <button
                className="bg-danger text-light border-0 rounded px-2 py-1 fs-1"
                onClick={() => setConfirmRejectModal(true)}
                disabled={isLoading}
              >
                <i className="fas fa-times"></i> Reject All
              </button>
            </div>
          </div>
        </div>

        <div className="products-table">
          <Table>
            <thead>
              <tr>
                <th>
                  <div className="d-flex">Product Name</div>
                </th>
                <th>Room</th>
                <th width="20%">Description</th>
                <th>Manufacturer</th>
                <th>Unit Of Sale</th>
                {/* <th>QTY</th> */}
                <th>Customer Approval</th>
                <th>Actions</th>
              </tr>
            </thead>
            {isLoading ? (
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td
                    className="spinner d-flex w-100 justify-content-center"
                    style={{ width: "100%", minHeight: "200px" }}
                  >
                    <Spinner animation="border" variant="primary" />
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {products?.map((templateItem, index) => {
                  // const tempTemplateItem = templateItems?.[templateItem?.ID];

                  // let requiresApproval = !!(templateItem?.RequiresApproval);
                  // let isRoughIn = templateItem?.RoughInTrimOutEnum === 'RoughIn';
                  // let isTrimOut = templateItem?.RoughInTrimOutEnum === 'TrimOut';
                  // let quantity = templateItem?.Quantity ? templateItem?.Quantity : 1;

                  // if (!isEmpty(tempTemplateItem)) {
                  //     quantity = tempTemplateItem.Quantity;
                  //     requiresApproval = tempTemplateItem.RequiresApproval;
                  //     isRoughIn = tempTemplateItem.RoughInTrimOutEnum === 'RoughIn';
                  //     isTrimOut = tempTemplateItem.RoughInTrimOutEnum === 'TrimOut';

                  // }
                  // if (templateItem.IsTemplate === false) console.log('template', templateItem, requiresApproval);

                  const { Product } = templateItem;
                  return (
                    <tr key={index}>
                      <td width="20%">
                        <div className="d-flex add-btn-templateItem">
                          {Product?.ThumbnailURL && (
                            <img
                              width="50"
                              height="50"
                              alt="template item"
                              src={Product?.ThumbnailURL}
                              className="mr-2"
                            />
                          )}
                          <div className="pl-1">
                            {Product?.ProductName}
                            {!Product?.IsTemplate && (
                              <div className="model-number">
                                Model: {Product?.ModelNumber}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{templateItem.ProjectRoom?.Name}</td>
                      <td width="20%">
                        {Product?.ShortDescription
                          ? Product?.ShortDescription
                          : "-"}
                      </td>
                      <td>
                        <div
                          className="d-flex align-items-center"
                          style={{ gap: "10px", objectFit: "contain" }}
                        >
                          {Product?.Manufacturer?.LogoUrl && (
                            <CustomLightbox
                              singleImageProps={{
                                width: "50px",
                                height: "auto",
                              }}
                              images={[Product?.Manufacturer?.LogoUrl]}
                            />
                          )}
                          {Product?.Manufacturer?.ManufacturerName}
                        </div>
                      </td>
                      <td>{Product?.UnitOfSale}</td>

                      {/* <td>{Product.Quantity}</td> */}
                      <td>
                        <small
                          className={`
                        text-center
                        px-2 py-1
                        rounded
                        text-light
                        ${
                          templateItem?.ApprovalStatusID === 1
                            ? "bg-success"
                            : templateItem?.ApprovalStatusID === 2
                            ? "bg-danger"
                            : "bg-secondary"
                        }
                      `}
                        >
                          {templateItem?.ApprovalStatusID === 1
                            ? "Approved"
                            : templateItem?.ApprovalStatusID === 2
                            ? "Rejected"
                            : "Pending"}{" "}
                        </small>
                        <br />
                        <small className="d-block mt-1">
                          {templateItem?.ApprovalStatusID &&
                          (templateItem?.ApprovalStatusID !== 2 ||
                            templateItem?.ApprovalStatusID !== 1)
                            ? moment(Product?.DateApproved).format("MM/DD/Y")
                            : null}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex ">
                          <button
                            className="bg-success text-light mr-1 border-0 rounded py-2"
                            onClick={() => {
                              setSelectedProduct(templateItem);
                              setconfirmApproveModalSingle(true);
                            }}
                          >
                            {/* ID, ProductID, IsCustomProduct, StatusID */}
                            <i className="fas fa-check-double"></i> Approve
                          </button>

                          <button
                            className="bg-danger text-light border-0 rounded py-2"
                            onClick={() => {
                              setSelectedProduct(templateItem);
                              setconfirmRejectModalSingle(true);
                            }}
                          >
                            <i className="fas fa-times"></i> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </Table>
        </div>
      </div>

      <ConfirmApproveAllModal
        text="Are you sure you want to approve all products?"
        subtext="Approve Always: will approve the current list as well as upcoming same products as Approved, Approve Once: will approve the products in the current list only"
        show={confirmApproveModal}
        handleClose={() => setConfirmApproveModal(false)}
        handleConfirm={(always) => approvalAll(1, always)}
        alwaysButtonText={"Approve Always"}
        confirmButtonText={"Approve Once"}
        showSpinner={showSpinner}
      />

      <ConfirmApproveAllModal
        text="Are you sure you want to reject all products?"
        subtext="Reject Always: will reject the current list as well as upcoming same products as Rejected, Reject Once: will reject the products in the current list."
        show={confirmRejectModal}
        handleClose={() => setConfirmRejectModal(false)}
        handleConfirm={(always) => approvalAll(2, always)}
        alwaysButtonText={"Reject Always"}
        confirmButtonText={"Reject Once"}
        showSpinner={showSpinner}
        isRejectModal
      />
      <ConfirmApproveAllModal
        text="Select Option"
        subtext="approve Always: will approve this product as well as it will be approve all over in the project, approve Once: will approve the current product only."
        show={confirmApproveModalSingle}
        handleClose={() => setconfirmApproveModalSingle(false)}
        handleConfirm={(always) =>
          approvalSingle(
            selectedProduct?.ID,
            selectedProduct?.Product?.ID,
            selectedProduct?.IsCustomProduct,
            1,
            always
          )
        }
        alwaysButtonText={"Approve Always"}
        confirmButtonText={"Approve Once"}
      />
      <ConfirmApproveAllModal
        text="Select Option"
        subtext="Reject Always: will reject this product as well as it will be reject all over in the project, Reject Once: will reject the current product only."
        show={confirmRejectModalSingle}
        handleClose={() => setconfirmRejectModalSingle(false)}
        handleConfirm={(always) =>
          approvalSingle(
            selectedProduct?.ID,
            selectedProduct?.Product?.ID,
            selectedProduct?.IsCustomProduct,
            2,
            always
          )
        }
        alwaysButtonText={"Reject Always"}
        confirmButtonText={"Reject Once"}
        isRejectModal
      />
    </div>
  );
};

export default CustomerProducts;
