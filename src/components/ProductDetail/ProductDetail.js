import React, { useEffect, useRef, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails, setSelectedProductTab } from '../../actions/productActions';
import { handleProductForProject } from '../../actions/projectActions';
import './ProductDetail.scss';

const ProductDetail = ( ) => {
    const dispatch = useDispatch();

    const product = useSelector(state => state.product.product);
    const selectedRoom = useSelector(state => state.room.selectedRoom);
    const productDetail = useSelector(state => state.product.productDetail);

    const [isLoading, setIsLoading] = useState(true);

    const productDetailRef = useRef();

    useEffect(() => {
        productDetailRef.current = productDetail;
    }, [productDetail]);

    useEffect(() => {
        dispatch(getProductDetails(productDetailRef.current?.ID))
            .then(() => setIsLoading(false))
            .catch(() => setIsLoading(false));
    }, [dispatch]);

    const handleNavigation = (selectedTab) => {
        dispatch(setSelectedProductTab(selectedTab));
    }

    const addProduct = () => {
        if (!productDetailRef.current?.ID || !selectedRoom.ID) return;

        const newProduct = {
            ...product, 
            ProductID: productDetailRef.current.ID,
            ProjectRoomID: selectedRoom.ID
        }

        delete newProduct.CategoryID

        dispatch(handleProductForProject([newProduct]))
            .then(
                dispatch(setSelectedProductTab('products'))
            );
    }
    console.log('Product Details', productDetail);

    return (
        <div className='product-detail'>
            <div className='d-flex title'>
                <div>
                    <Button 
                        variant='link' 
                        className='link-btn'
                        onClick={() => handleNavigation('products')}
                    >
                        Products /
                    </Button>
                </div>  
                <div>
                    <Button 
                        variant='link' 
                        className='link-btn'
                        onClick={() => handleNavigation('addProduct')}
                    >
                        Add Product /
                    </Button>
                </div>  
                <div>
                    <Button 
                        variant='link' 
                        className='link-btn'
                        // onClick={() => handleShow(false)}
                    >
                        Products
                    </Button>
                </div>  
            </div>

            {isLoading ? (
                <div className='spinner d-flex justify-content-center'>
                    <Spinner
                        animation='border'
                        variant='primary' 
                    />
                </div>
            ) : (
                <div className='d-flex justify-content-between details-container'>
                    <div className='details-image'>
                        <img
                            alt='product details' 
                            src={productDetail?.ThumbnailURL}
                        />
                    </div>
                    <div className='details'>
                        <div className='d-flex justify-content-between'>
                            <div>
                                <div className='details-title'>{productDetail?.ProductName}</div>
                                <div className='description'>{productDetail?.ShortDescription}</div>
                            </div>
                            <button 
                                className='add-button'
                                onClick={addProduct}
                            >
                                Add to Project
                            </button>
                        </div>
                        <div className='mt-5 d-flex justify-content-between'>
                            <div className='sub-details'>
                                <div>Item #</div>
                                <div>Model #{productDetail?.ModelNumber}</div>
                            </div>
                            <div>${productDetail?.MSRP} {productDetail?.UnitOfSale}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductDetail;