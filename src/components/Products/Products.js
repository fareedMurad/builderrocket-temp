import React, { useEffect, useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedRoom } from '../../actions/roomActions';
import { setSelectedTemplateItem } from '../../actions/productActions';
import './Products.scss';

// components 
import AddProduct from '../../components/AddProduct';

const Products = (props) => {
    const dispatch = useDispatch();

    const project = useSelector(state => state.project.project);
    const selectedRoom = useSelector(state => state.room.selectedRoom);

    const [isAddProducts, setIsAddProducts] = useState(false);

    console.log('PROJECT PRODUCTS', project);
    console.log('Selected Room', selectedRoom);

    useEffect(() => {
        if (project?.ProjectRooms?.[0])
            dispatch(setSelectedRoom(project.ProjectRooms?.[0]));
    }, [dispatch, project]);

    const handleSelectedRoom = (roomIndex) => {
        const selectedRoomObj = project?.ProjectRooms?.[roomIndex];
        
        dispatch(setSelectedRoom(selectedRoomObj));
    }

    const handleSelectedTemplateItem = (templateItem) => {
        setIsAddProducts(true);

        dispatch(setSelectedTemplateItem(templateItem));
    }

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
                                    onChange={(e) => handleSelectedRoom(e.target.value)}
                                >
                                    {project?.ProjectRooms?.map((projectRoom, index) => (
                                        <option 
                                            key={index} 
                                            value={index}
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
                                    <th>Rough In / Trim Out</th>
                                    <th>Distributor</th>
                                    <th>QTY</th>
                                    <th>Price</th>
                                    <th>Customer Approval</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedRoom?.TemplateItems?.map((templateItem, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div className='d-flex'>
                                                <Form.Check 
                                                    type='checkbox'
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div className='add-btn-templateItem'>
                                                <i className='fas fa-plus-circle plus-circle'></i>
                                                <Button 
                                                    variant='link' 
                                                    className='link-btn'
                                                    onClick={() => handleSelectedTemplateItem(templateItem)}
                                                >
                                                    {templateItem?.AddLabel} 
                                                </Button>
                                            </div>  
                                        </td>
                                        <td></td>
                                        <td>{templateItem?.CategoryName}</td>
                                        <td></td>
                                        <td>
                                            <div className='d-flex'>
                                                <Form.Check 
                                                    type='radio'
                                                />
                                                <Form.Check 
                                                    type='radio'
                                                />
                                            </div>
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