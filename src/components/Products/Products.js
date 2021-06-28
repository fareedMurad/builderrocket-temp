import React, { useEffect, useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedRoom } from '../../actions/roomActions';
import { setSelectedCategoryID } from '../../actions/productActions';
import './Products.scss';

// components 
import AddProduct from '../../components/AddProduct';

const Products = (props) => {
    const dispatch = useDispatch();

    const project = useSelector(state => state.project.project);
    const selectedRoom = useSelector(state => state.room.selectedRoom);

    const [isAddProducts, setIsAddProducts] = useState(false);
    // const [templateItems, setTemplateItems] = useState({});
    
    useEffect(() => {
        if (!selectedRoom)
        dispatch(setSelectedRoom(project.ProjectRooms?.[0]));
    }, [dispatch, project, selectedRoom]);
    
    const handleSelectedRoom = (roomID) => {
        const selectedRoomObj = project?.ProjectRooms?.find((room) => room.ID === parseInt(roomID));
        
        dispatch(setSelectedRoom(selectedRoomObj));
    }
    
    const handleSelectedCategoryID = (categoryID) => {
        setIsAddProducts(true);
        
        dispatch(setSelectedCategoryID(categoryID));
    }
    
    console.log('Project', project);

    return (
        <div className='d-flex products'>
            {!isAddProducts ?
                <div className='products-container'>
                    <div className='d-flex justify-content-between'>
                        <div>
                            <div className='page-title'>Products</div>
                            <div className='subtext'>The products assinged to each room are displayed below.</div>
                        </div>

                        <div>
                            <Button variant='link' className='link-btn'>
                                <i className='fas fa-download'></i>
                                Download Report
                            </Button>
                            <Button variant='link' className='link-btn'>
                                <i className='fas fa-share-alt'></i>
                                Share to Distributor
                            </Button>
                            <Button variant='link' className='link-btn'>
                                <i className='fas fa-share-square'></i>
                                Share to Customer
                            </Button>
                            <Button variant='link' className='link-btn'>
                                <i className='fas fa-th'></i>
                                Category Layout
                            </Button>
                        </div>
                    </div>

                    <div className='middle-section'>
                        <div className='d-flex'>
                            <div>
                                <Form.Control 
                                    as='select'
                                    value={selectedRoom?.ID}
                                    onChange={(e) => handleSelectedRoom(e.target.value)}
                                >
                                    {project?.ProjectRooms?.map((projectRoom, index) => (
                                        <option 
                                            key={index} 
                                            value={projectRoom?.ID}
                                        >
                                            {projectRoom.RoomName}
                                        </option>
                                    ))}
                                </Form.Control>
                            </div>

                            <div className='ml-1 add-btn'>
                                <Button 
                                    variant='link' 
                                    className='link-btn'
                                >
                                    + Add Products
                                </Button>
                            </div>  
                        </div>
                        <div className='total'>
                            Total: $0.00
                        </div>
                    </div>

                    <div className='products-table'>
                        <div className='table-title'>Title</div>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Needs Approval</th>
                                    <th>Product Name</th>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>UOM</th>
                                    <th className='radios'>Rough In / Trim Out</th>
                                    <th>Distributor</th>
                                    <th>QTY</th>
                                    <th>Price</th>
                                    <th>Customer Approval</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedRoom?.Items?.map((templateItem, index) => (
                                    <tr key={index}>
                                        <td className='approval-checkbox'>
                                            <Form>
                                                <Form.Check 
                                                    type='checkbox'
                                                    checked={templateItem?.IsApproved}
                                                />
                                            </Form>
                                        </td>
                                        <td>
                                            <div className='add-btn-templateItem'>
                                                <Button 
                                                    variant='link' 
                                                    className='link-btn'
                                                    onClick={() => handleSelectedCategoryID(templateItem?.CategoryID)}
                                                >
                                                    <i className='fas fa-plus-circle plus-circle'></i>
                                                    {templateItem?.AddLabel} 
                                                </Button>
                                            </div>  
                                        </td>
                                        <td></td>
                                        <td>{templateItem?.CategoryName}</td>
                                        <td></td>
                                        <td>
                                            <Form className='d-flex justify-content-center'>
                                                <Form.Check 
                                                    type='radio'
                                                    checked={templateItem?.RoughInTrimOutEnum === 'RoughIn'}
                                                />
                                                <Form.Check 
                                                    type='radio'
                                                    checked={templateItem?.RoughInTrimOutEnum === 'TrimOut'}
                                                />
                                            </Form>
                                        </td>
                                        <td>
                                            <div className='distributor-select'>
                                                <Form.Control as='select'>
                                                </Form.Control>
                                            </div>
                                        </td>
                                        <td>  
                                            <div className='qty-select'>
                                                <Form.Control as='select'>
                                                </Form.Control>
                                            </div>
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <div className='d-flex justify-content-between'>
                                                <i className='fas fa-retweet'></i>
                                                <i className={`far ${true ? 'fa-heart' : 'fas-heart'}`}></i>
                                                <i className='far fa-trash-alt'></i>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </Table>
                    </div>
                </div>
            :
                <AddProduct handleShow={setIsAddProducts} />
            }
        </div>
    );
}

export default Products;