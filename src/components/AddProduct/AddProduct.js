import React, { useEffect } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories, searchProducts } from '../../actions/productActions';
import './AddProduct.scss';

const AddProduct = (props) => {
    const { handleShow } = props;

    const dispatch = useDispatch();

    const products = useSelector(state => state.product.products);
    const productCategories = useSelector(state => state.product.productCategories);
    const selectedTemplateItem = useSelector(state => state.product.selectedTemplateItem);
    
    // console.log('SELECTED', productCategories);
    // console.log('Selected Template Item', selectedTemplateItem);
    // console.log('PRODUCTS', products);

    useEffect(() => {
        if (selectedTemplateItem?.CategoryID)
            dispatch(getCategories(selectedTemplateItem?.CategoryID));
    }, [dispatch, selectedTemplateItem]);

    useEffect(() => {
        if (selectedTemplateItem?.CategoryID)
            dispatch(searchProducts(selectedTemplateItem?.CategoryID));
    }, [dispatch, selectedTemplateItem]);

    const onProductCategoryChange = (productCategoryID, updatedFilter) => {
        if (!productCategoryID) return;

        dispatch(searchProducts(productCategoryID));
    }

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
                            value={selectedTemplateItem?.CategoryID}
                            onChange={(event) => onProductCategoryChange(event.target.value)}
                        >
                            <option value=''>Select Category</option>
                            {productCategories?.map((productCategory, index) => (
                                <option 
                                    key={index} 
                                    value={productCategory?.ID}
                                >
                                    {productCategory?.Name}
                                </option>
                            ))}
                        </Form.Control>
                    </div>
                    <div>
                        <Form.Control placeholder='Search Keywords'>
                        </Form.Control>
                    </div>
                    <div className='d-flex qty-items-select'>
                        <Form.Control as='select'>
                            <option>25</option>
                        </Form.Control>
                        <div className='select-text'>Items Per Page</div>
                    </div>
                </div>
            </div>

            <div className='add-products-body d-flex'>
                <div className='checkbox-filter'>
                    {products?.CustomFilters && Object.keys(products?.CustomFilters)?.map((filter, index) => (
                        <div key={index} className='mt-3 mb-5'>
                            <div className='bold-text mb-3'>{filter}</div>

                            {products?.CustomFilters?.[filter]?.splice(0, 10)?.map((filterChild, index) => (
                                <Form.Check 
                                    key={index}
                                    className='mt-2'
                                    type='checkbox'
                                    label={filterChild?.Name}
                                />
                            ))}
                        </div>
                    ))}
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
                            {products?.Products?.splice(0, 25).map((product, index) => (
                                <tr key={index}>
                                    <td>{product?.Name}</td>
                                    <td>{product?.ProductName}</td>
                                    <td></td>
                                    <td>{product?.ColorFinish}</td>
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
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

export default AddProduct;