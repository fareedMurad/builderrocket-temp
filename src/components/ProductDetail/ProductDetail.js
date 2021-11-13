import React, { useEffect, useRef } from 'react';
import { getProductDetails, setSelectedProductTab } from '../../actions/productActions';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import './ProductDetail.scss';

const ProductDetail = ( ) => {
    const dispatch = useDispatch();

    const productDetail = useSelector(state => state.product.productDetail);

    const productDetailRef = useRef();

    useEffect(() => {
        productDetail.current = productDetail;
    }, [productDetail]);

    useEffect(() => {
        dispatch(getProductDetails(productDetailRef.current?.ID));
    }, [dispatch]);

    const handleNavigation = (selectedTab) => {
        dispatch(setSelectedProductTab(selectedTab));
    }

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

            <div className='d-flex justify-content-between details-container'>
                <div className='details-image'>
                    <img
                        alt='product details' 
                        src={productDetail?.ThumbnailURL}
                    />
                </div>
                <div className='details'>
                    <div className='details-title'>{productDetail?.ProductName}</div>

                    <div className='description'>{productDetail?.ShortDescription}</div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail;