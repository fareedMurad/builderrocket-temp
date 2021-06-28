import React, { useEffect, useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories, searchProducts, setSelectedCategoryID } from '../../actions/productActions';
import './AddProduct.scss';

const AddProduct = (props) => {
    const { handleShow } = props;

    const dispatch = useDispatch();

    const products = useSelector(state => state.product.products);
    const productCategories = useSelector(state => state.product.productCategories);
    const selectedCategoryID = useSelector(state => state.product.selectedCategoryID);

    const [searchTerm, setSearchTerm] = useState('');
    // console.log('Products', products);

    useEffect(() => {
        if (selectedCategoryID)
            dispatch(getCategories(selectedCategoryID));
    }, [dispatch, selectedCategoryID]);

    useEffect(() => {
        if (selectedCategoryID)
            dispatch(searchProducts(selectedCategoryID));
    }, [dispatch, selectedCategoryID]);

    const onProductCategoryChange = (productCategoryID) => {
        if (!productCategoryID) return;

        dispatch(setSelectedCategoryID(productCategoryID));
    }

    // update individual filter checkbox 
    const handleFilters = (filterType, filterChild, filterChildIndex) => {
        let updatedFilterChild = filterChild;

        if (updatedFilterChild.IsChecked) {

            updatedFilterChild.IsChecked = false;
        } else {
            updatedFilterChild.IsChecked = true;
        }

        let updatedFilters = products?.CustomFilters;

        updatedFilters[filterType][filterChildIndex] = updatedFilterChild;
 
        const searchObject = {
            CategoryID: selectedCategoryID,
            ModelName: null,
            Description: null, 
            CustomFilters: updatedFilters
        }

        dispatch(searchProducts(selectedCategoryID, searchObject))
    }

    // const addProduct = () => {
        
    // }

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
                            value={selectedCategoryID}
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
                    <div className='d-flex'>
                        <Form.Control 
                            placeholder='Search Keywords'
                            onChange={(e) => setSearchTerm(e.target.value)}    
                        >
                        </Form.Control>
                        <button className='primary-gray-btn search-btn ml-3'>Search</button>
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

                            {products?.CustomFilters?.[filter]?.map((filterChild, childIndex) => (
                                <Form.Check 
                                    key={childIndex}
                                    type='checkbox'
                                    className='mt-2'
                                    label={filterChild?.Name}
                                    value={filterChild?.IsChecked}
                                    onClick={() => handleFilters(filter, filterChild, childIndex)}
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
                                    <td>
                                        <img
                                            alt='product' 
                                            width='50'
                                            height='50'
                                            src={product?.ThumbnailURL}
                                        />
                                    </td>
                                    <td>
                                        {product?.BrandName}
                                        {' '}
                                        {product?.ProductName}
                                    </td>
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