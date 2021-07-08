import React, { useEffect, useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { handleProductForProject } from '../../actions/projectActions';
import { getCategories, searchProducts, setSelectedCategoryID } from '../../actions/productActions';
import './AddProduct.scss';

// components 
import ProductModal from '../ProductModal';

const AddProduct = (props) => {
    const { handleShow } = props;
    
    const dispatch = useDispatch();

    const product = useSelector(state => state.product.product);
    const products = useSelector(state => state.product.products);
    const selectedRoom = useSelector(state => state.room.selectedRoom);
    const productCategories = useSelector(state => state.product.productCategories);

    // const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);

    console.log('Product', products, props);

    useEffect(() => {
        if (product)
            dispatch(getCategories(product?.CategoryID));
    }, [dispatch, product]);

    useEffect(() => {
        if (product)
            dispatch(searchProducts(product?.CategoryID));
    }, [dispatch, product]);

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
            CategoryID: product?.CategoryID,
            ModelName: null,
            Description: null, 
            CustomFilters: updatedFilters
        }

        dispatch(searchProducts(product?.CategoryID, searchObject));
    }

    const addProduct = (productID) => {
        if (!productID) return;

        const newProduct = {
            ...product, 
            ProductID: productID
        }

        delete newProduct.CategoryID

        dispatch(handleProductForProject(selectedRoom?.ID, [newProduct]))
            .then(
                handleShow(false)
            );
    }


    return (
        <div className='add-product-container'>
            <div className='d-flex'>
                <div>
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
                            value={product?.CategoryID}
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
                            // onChange={(e) => setSearchTerm(e.target.value)}    
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
                            {products?.Products?.map((product, index) => (
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
                                        <button 
                                            className='add-product-btn'
                                            onClick={() => addProduct(product?.ID)}
                                        >
                                            Add
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        

            <ProductModal show={showModal} handleClose={setShowModal} />
        </div>
    );
}

export default AddProduct;