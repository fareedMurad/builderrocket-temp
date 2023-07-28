import React, { useCallback, useEffect, useState } from "react";
import { customerSingleApproval } from "../../actions/projectActions";
import { Form, Table } from "react-bootstrap";
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

const CustomerProducts = (props) => {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.customer.products);
  const project = useSelector((state) => state.project.project);
  const selectedRoom = useSelector((state) => state.room.selectedRoom);
  const customerproject = useSelector((state) => state.auth.customerproject);
  const [templateItems, setTemplateItems] = useState({});
  const [confirmApproveModal, setConfirmApproveModal] = useState(false);
  const [confirmRejectModal, setConfirmRejectModal] = useState(false);

  useEffect(() => {
    // if (isEmpty(selectedRoom))
    //   dispatch(setSelectedRoom(project?.ProjectRooms?.[0]));

    dispatch(getCustomerProducts());
  }, [dispatch, project, selectedRoom]);

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

  const approvalSingle = (ID, ProductID, StatusID) => {
    const object = {
        ID,
        ProductID,
        StatusID
    }
    dispatch(customerApprovalProducts([object])).then(() => {
        const filter = products.map(p => {
            if(p.ID ===ID) {
                return {...p, ApprovalStatusID: StatusID}
            }else return p
        })
        dispatch({ type: GET_CUSTOMER_PRODUCTS, payload: filter })
    });;
  };

  const approvalAll = (StatusID) => {
    const sendData = products.map(p => {
        return {
            ID: p.ID,
            ProductID: p.Product?.ID,
            StatusID
        }
    });
    dispatch(customerApprovalProducts(customerproject, sendData));

    if(StatusID === 1)
    setConfirmApproveModal(false);


    if(StatusID === 2)
    setConfirmRejectModal(false);
  };

  console.log(products, "products");

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

        <div className="d-flex justify-content-between pt-3">
          <div></div>
          <div className="d-flex justify-content-between">
            <button
              class="bg-success text-light mr-1 border-0 rounded px-2 py-1 fs-1"
              onClick={() => setConfirmApproveModal(true)}
            >
              <i class="fas fa-check-double"></i> Approve All
            </button>

            <button
              class="bg-danger text-light border-0 rounded px-2 py-1 fs-1"
              onClick={() => setConfirmRejectModal(true)}
            >
              <i class="fas fa-times"></i> Reject All
            </button>
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
                <th>Unit Of Sale</th>
                {/* <th>QTY</th> */}
                <th>Customer Approval</th>
                <th>Actions</th>
              </tr>
            </thead>
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
                        <div class="pl-1">
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
                        {(templateItem?.ApprovalStatusID !== 2 ||
                          templateItem?.ApprovalStatusID !== 1) &&
                            moment(Product?.DateApproved).format("MM/DD/Y")}
                      </small>
                    </td>
                    <td>
                      <div className="d-flex ">
                        <button
                          class="bg-success text-light mr-1 border-0 rounded py-2"
                          onClick={() => approvalSingle(templateItem.ID, Product?.ID, 1)}
                        >
                          <i class="fas fa-check-double"></i> Approve
                        </button>

                        <button
                          class="bg-danger text-light border-0 rounded py-2"
                            onClick={() => approvalSingle(templateItem.ID, Product?.ID, 2)}
                        >
                          <i class="fas fa-times"></i> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>

      <ConfirmApproveAllModal
        text="Are you sure you want to approve all pending products?"
        show={confirmApproveModal}
        handleClose={() => setConfirmApproveModal(false)}
        handleConfirm={() => approvalAll(1)}
      />

      <ConfirmApproveAllModal
        text="Are you sure you want to reject all pending products?"
        show={confirmRejectModal}
        handleClose={() => setConfirmRejectModal(false)}
        handleConfirm={() => approvalAll(2)}
      />
    </div>
  );
};

export default CustomerProducts;
