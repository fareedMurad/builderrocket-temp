import React from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import './Products.scss';

// components 

const Products = (props) => {

    const project = useSelector(state => state.project.project);
    console.log('PROJECT PRODUCTS', project);

    return (
        <div className='d-flex products'>
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
                            <Form.Control as='select'>
                                {project?.ProjectRooms?.map((projectRoom, index) => (
                                    <option key={index}>{projectRoom.RoomName}</option>
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
                            <tr>
                                <td>
                                    <div className='d-flex'>
                                        <Form.Check 
                                            type='checkbox'
                                        />
                                    </div>
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
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
                        </tbody>

                    </Table>
                </div>

            </div>

        </div>
    );
}

export default Products;