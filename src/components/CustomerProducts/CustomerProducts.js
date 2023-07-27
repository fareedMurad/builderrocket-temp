import React, { useCallback, useEffect, useState } from "react";
import {
  customerAllApproval,
  customerSingleApproval,
  editProduct,
  handleProductForProject,
} from "../../actions/projectActions";
import { Form, Table } from "react-bootstrap";
import { setSelectedRoom } from "../../actions/roomActions";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty, isUndefined } from "lodash";
import moment from "moment";
import "./CustomerProducts.scss";
import { getCustomerProducts } from "../../actions/customerActions";

const CustomerProducts = (props) => {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.customer.products);
  const project = useSelector((state) => state.project.project);
  const selectedRoom = useSelector((state) => state.room.selectedRoom);
  const customerproject = useSelector((state) => state.auth.customerproject);
  const [templateItems, setTemplateItems] = useState({});

  useEffect(() => {
    if (isEmpty(selectedRoom))
      dispatch(setSelectedRoom(project?.ProjectRooms?.[0]));

    dispatch(getCustomerProducts());
  }, [dispatch, project, selectedRoom]);

  const handleSelectedRoom = useCallback(
    (roomID) => {
      const selectedRoomObj = project?.ProjectRooms?.find(
        (room) => room.ID === parseInt(roomID)
      );

      dispatch(setSelectedRoom(selectedRoomObj));
    },
    [dispatch, project]
  );

  useEffect(() => {
    if (!isEmpty(selectedRoom)) handleSelectedRoom(selectedRoom?.ID);
  }, [project, selectedRoom, handleSelectedRoom]);

  const handleItems = (incomingItem, key, value) => {
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

  const approvalSingle = (ID, status) => {
    const sendData = { ID: ID, ApprovalStatusID: status };
    dispatch(customerSingleApproval(customerproject, [sendData]));
  };
  const approvalAll = (ID, status) => {
    const sendData = { ProductID: ID, ApprovalStatusID: status };
    dispatch(customerAllApproval(customerproject, [sendData]));
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

        <div className="products-table">
          <Table>
            <thead>
              <tr>
                <th>
                  <div className="d-flex">
                    Product Name
                  </div>
                </th>
                <th width="30%">Description</th>
                <th>Unit Of Sale</th>
                <th>QTY</th>
                <th>Customer Approval</th>
                <th></th>
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
                    <td>
                      <div className="d-flex add-btn-templateItem">
                        {Product?.ThumbnailURL && (
                          <img
                            width="50"
                            height="50"
                            alt="template item"
                            src={Product?.ThumbnailURL}
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
                    <td width="30%">
                      {Product?.ShortDescription
                        ? Product?.ShortDescription
                        : "-"}
                    </td>
                    <td>
                      {Product?.UnitOfSale}
                    </td>

                    <td>{Product.Quantity}</td>
                    <td>
                      <i
                        className="fas fa-check-circle text-success approvicon"
                        onClick={() => approvalSingle(Product?.ID, "1")}
                      ></i>
                      <i
                        className="fas fa-times-circle text-danger approvicon"
                        onClick={() => approvalSingle(Product?.ID, "-1")}
                      ></i>
                      <br />
                      <small>
                        {Product?.ApprovalStatusID === 0
                          ? "Pending"
                          : Product?.ApprovalStatusID === 1
                          ? "Approved"
                          : "Rejected"}{" "}
                        {moment(Product?.DateApproved).format("MM/DD/Y")}
                      </small>
                    </td>
                    <td>
                      <div className="d-flex justify-content-between">
                        <button
                          class="bg-success text-light"
                          onClick={() =>
                            approvalAll(Product?.ProductID, "1")
                          }
                        >
                          <i class="fas fa-check-double"></i> All
                        </button>

                        <button
                          class="bg-danger text-light"
                          onClick={() =>
                            approvalAll(Product?.ProductID, "-1")
                          }
                        >
                          <i class="fas fa-times"></i> All
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
    </div>
  );
};

export default CustomerProducts;
