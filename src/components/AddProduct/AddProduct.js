import React, { useEffect } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '../../actions/productActions';
import './AddProduct.scss';

const AddProduct = (props) => {
    const { handleShow } = props;

    const dispatch = useDispatch();

    const selectedRoom = useSelector(state => state.room.selectedRoom);
    const productCategories = useSelector(state => state.product.productCategories);
    const selectedTemplateItem = useSelector(state => state.product.selectedTemplateItem);
    
    console.log('SELECTED', productCategories);
    console.log('Selected Template Item', selectedTemplateItem);

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    return (
        <div className='add-product-container'>
            <div className='d-flex'>
                <div className='add-btn'>
                    <Button 
                        variant='link' 
                        className='link-btn'
                        onClick={() => handleShow(false)}
                    >
                        Products /
                    </Button>
                </div>  
                <div className='page-title'>Add Products</div>
            </div>

            <div className='filter-section'>
                <div className='d-flex'>
                    <div className='mr-3'>
                        <Form.Control 
                            as='select'
                            defaultValue={selectedTemplateItem?.ID}
                        >
                            {selectedRoom?.TemplateItems?.map((templateItem, index) => (
                                <option 
                                    key={index} 
                                    value={templateItem?.ID}
                                >
                                    {templateItem?.CategoryName}
                                </option>
                            ))}
                        </Form.Control>
                    </div>
                    <div className='mr-3'>
                        <Form.Control 
                            as='select'
                        >
                            <option>Sub Category</option>
                        </Form.Control>
                    </div>
                    <div>
                        <Form.Control placeholder='Search Keywords'>
                        </Form.Control>
                    </div>
                    <div className='d-flex qty-items-select'>
                        <Form.Control as='select'>
                            <option>50</option>
                        </Form.Control>
                        <div className='select-text'>Items Per Page</div>
                    </div>
                </div>
            </div>

            <div className='add-products-body d-flex'>
                <div className='checkbox-filter'>
                    <div>
                        <div className='bold-text mb-3 mt-4'>Favorites</div>
                        <Form.Check 
                            type='checkbox'
                            label='Only Show Favorites' 
                        />
                    </div>
                    <div>
                        <div className='bold-text mb-3 mt-4'>Brand</div>
                        <Form.Check 
                            type='checkbox'
                            label='Chris' 
                        />
                    </div>
                    <div>
                        <div className='bold-text mb-3 mt-4'>Type</div>
                        <Form.Check 
                            type='checkbox'
                            label='Bamboo' 
                        />
                    </div>
                    <div>
                        <div className='bold-text mb-3 mt-4'>Color/Finish</div>
                        <Form.Check 
                            type='checkbox'
                            label='Charcoal' 
                        />
                    </div>
                </div>

                <div className='add-product-table'>
                    <Table hover responsive>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Product Name</th>
                                <th>Project Status</th>
                                <th>Color/Finish</th>
                                <th>Distributor</th>
                                <th>Price</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                    <div className='distributor-select'>
                                        <Form.Control as='select'>
                                        </Form.Control>
                                        <div>Available from x vendors</div>
                                    </div>
                                </td>
                                <td></td>
                                <td>
                                    <i className={`far ${true ? 'fa-heart' : 'fas-heart'}`}></i>
                                </td>
                                <td>
                                    <button className='add-product-btn'>Add</button>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

export default AddProduct;