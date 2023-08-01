import React from "react";
import "react-bootstrap-accordion/dist/index.css";
import { Accordion } from "react-bootstrap-accordion";
import { Table } from "react-bootstrap";

const RoomTypes = [
    {
        id: 1,
        roomTypename: "Room Type 1",
        noOfRooms: 10,
        rooms: [
            {
                id: 1,
                RoomName: "room1",
                group: "Group 1"
            },
            {
                id: 2,
                RoomName: "room2",
                group: "Group 2"
            }
        ]
    },
    {
        id: 2,
        roomTypename: "Room Type 2",
        noOfRooms: 8,
        rooms: [
            {
                id: 1,
                RoomName: "room1",
                group: "Group 1"
            },
            {
                id: 2,
                RoomName: "room2",
                group: "Group 2"
            }
        ]
    },
]

const RoomsTypes = () => {
    return (
        <div className='room-management-container'>
            {
                RoomTypes?.map((item, index) => (
                    <Accordion
                        title={<div className='d-flex justify-content-between w-100 pr-5'><div>{item.roomTypename}</div><div><span className="px-2">{item.noOfRooms}</span>  <i className='far fa-pen fa-sm tab-icon px-2'></i><i className='far fa-plus fa-sm tab-icon px-2'></i><i className='far fa-trash fa-sm tab-icon px-2'></i></div></div>}
                        children={
                            <div>   <Table>
                                <tbody>
                                    {item.rooms?.map((templateItem, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{templateItem.RoomName}</td>
                                                <td>{templateItem.group}</td>
                                                <td><div><i className='far fa-pen fa-sm tab-icon px-2'></i><i className='far fa-trash fa-sm tab-icon px-2'></i></div></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table></div>
                        }
                    />
                ))
            }
        </div>
    )
}

export default RoomsTypes