import React from "react";
import "react-bootstrap-accordion/dist/index.css";
import { Accordion } from "react-bootstrap-accordion";
import { Table } from "react-bootstrap";

const Groups = [
  {
    id: 1,
    groupName: "Room Group 1",
    categorys: [
      {
        id: 1,
        name: "category 1",
      },
      {
        id: 2,
        name: "category 2",
      },
    ],
  },
  {
    id: 1,
    groupName: "Room Group 2",
    categorys: [
      {
        id: 1,
        name: "category 1",
      },
      {
        id: 2,
        name: "category 2",
      },
    ],
  },
];

const RoomGroups = () => {
  return (
    <div className="room-management-container">
      {Groups?.map((item, index) => (
        <Accordion
          title={
            <div className="d-flex justify-content-between w-100 pr-5">
              <div>{item.groupName}</div>
              <div>
                <button onClick={alert("Hey")}>
                  <i className="far fa-pen fa-sm tab-icon px-2"></i>
                </button>
                <i className="far fa-plus fa-sm tab-icon px-2"></i>
                <i className="far fa-trash fa-sm tab-icon px-2"></i>
              </div>
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
                            <i className="far fa-trash fa-sm tab-icon px-2"></i>
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
    </div>
  );
};

export default RoomGroups;
